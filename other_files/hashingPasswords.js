const bcrypt = require('bcryptjs');

const getEncryptedPassword = async (password) => {
    const hashedPassword = await bcrypt.hash(password, 10);
    
    console.log(hashedPassword);
}

getEncryptedPassword('password123');


/*

A typical Bcrypt hash looks like this:

    $2b$10$FhNnWizWsYNBy1l7fQRoWuK1.xzwakKqHdBILHtMQv.7BRr.8hyPq

It is composed of the following parts:

    - Version:

        $2b$: Indicates the version of the Bcrypt algorithm used.

    - Cost Factor (Salt Rounds):

        10: Indicates the cost factor (workload strength). This determines how computationally expensive the hashing operation is.

    - Salt:

        FhNnWizWsYNBy1l7fQRoWu: A 22-character base64-encoded salt that is generated randomly for each hash.

    - Hashed Password:

        K1.xzwakKqHdBILHtMQv.7BRr.8hyPq: The actual hash of the password combined with the salt.


bcrypt automatically generates a unique salt for each hash operation, which makes the resulting hashed password different every time

*/