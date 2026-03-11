const Show = require('../models/Show');
const mongoose = require('mongoose');

const lockSeat = async (showId, seatNumber, userId) => {
    const lockDurationMinutes = 10;
    const now = new Date();
    const lockExpiryThreshold = new Date(now.getTime() - lockDurationMinutes * 60 * 1000);

    // Atomic update: find the show and the specific seat that is available AND (not locked OR lock expired OR locked by the same user)
    const show = await Show.findOneAndUpdate(
        {
            _id: showId,
            'seatGrid': {
                $elemMatch: {
                    $elemMatch: {
                        seatNumber: seatNumber,
                        isAvailable: true,
                        $or: [
                            { isLocked: false },
                            { lockedAt: { $lt: lockExpiryThreshold } },
                            { lockedBy: userId }
                        ]
                    }
                }
            }
        },
        {
            $set: {
                'seatGrid.$[row].$[seat].isLocked': true,
                'seatGrid.$[row].$[seat].lockedBy': userId,
                'seatGrid.$[row].$[seat].lockedAt': now
            }
        },
        {
            arrayFilters: [
                { 'row': { $exists: true } },
                { 'seat.seatNumber': seatNumber }
            ],
            new: true
        }
    );

    if (!show) {
        // Either show doesn't exist, seat doesn't exist, or seat is already booked/locked by someone else
        const currentShow = await Show.findById(showId);
        if (!currentShow) throw new Error('Show not found');

        const seat = currentShow.seatGrid.flat().find(s => s.seatNumber === seatNumber);
        if (!seat) throw new Error('Seat not found in this show');
        if (!seat.isAvailable) throw new Error('Seat is already booked');
        throw new Error('Seat is currently locked by another user');
    }

    return show;
};

const unlockSeat = async (showId, seatNumber, userId) => {
    return await Show.findOneAndUpdate(
        {
            _id: showId,
            'seatGrid': {
                $elemMatch: {
                    $elemMatch: {
                        seatNumber: seatNumber,
                        isLocked: true,
                        lockedBy: userId
                    }
                }
            }
        },
        {
            $set: {
                'seatGrid.$[row].$[seat].isLocked': false,
                'seatGrid.$[row].$[seat].lockedBy': null,
                'seatGrid.$[row].$[seat].lockedAt': null
            }
        },
        {
            arrayFilters: [
                { 'row': { $exists: true } },
                { 'seat.seatNumber': seatNumber }
            ],
            new: true
        }
    );
};

const releaseExpiredLocks = async () => {
    const lockDurationMinutes = 10;
    const lockExpiryThreshold = new Date(Date.now() - lockDurationMinutes * 60 * 1000);

    // Note: multi:true is not supported with arrayFilters in findOneAndUpdate, 
    // but updateMany supports them starting from MongoDB 3.6.
    return await Show.updateMany(
        {
            'seatGrid': {
                $elemMatch: {
                    $elemMatch: {
                        isLocked: true,
                        lockedAt: { $lt: lockExpiryThreshold }
                    }
                }
            }
        },
        {
            $set: {
                'seatGrid.$[].$[seat].isLocked': false,
                'seatGrid.$[].$[seat].lockedBy': null,
                'seatGrid.$[].$[seat].lockedAt': null
            }
        },
        {
            arrayFilters: [
                { 'seat.isLocked': true, 'seat.lockedAt': { $lt: lockExpiryThreshold } }
            ]
        }
    );
};

module.exports = {
    lockSeat,
    unlockSeat,
    releaseExpiredLocks
};
