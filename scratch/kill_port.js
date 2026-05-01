const { exec } = require('child_process');

console.log('Attempting to clear port 5000...');

exec('fuser -k 5000/tcp', (err, stdout, stderr) => {
    if (err) {
        console.log('fuser failed or port was already clear. Trying lsof...');
        exec('kill -9 $(lsof -t -i:5000)', (err2, stdout2, stderr2) => {
            if (err2) {
                console.log('Could not find process on port 5000. It might be clear now.');
            } else {
                console.log('Successfully killed process using lsof.');
            }
        });
    } else {
        console.log('Successfully killed process using fuser.');
    }
});
