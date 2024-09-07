# ShoobPass - Personalized Password Manager

ShoobPass is a secure and personalized password manager built with React and Vite. It allows users to store and manage their passwords securely using advanced cryptographic techniques.

## Features

- Secure password storage using AES-GCM encryption
- Key derivation using PBKDF2 with a unique fixed salt
- User authentication and authorization
- Securely(using user's uniquely hashed password) Save and retrieve password entries to/from the cloud
- Responsive and user-friendly interface

## Basic Encryption & Decryption

ShoobPass uses cryptographic techniques to ensure the security of your password entries.

### Key Derivation
In this process, I have used PBKDF2 (Password-Based Key Derivation Function 2) algorithm to generate a secured key from the user's hashed password.

#### Step-by-Step Key Derivation
Encoding the Password:

- The user's password is first encoded into a byte array using the TextEncoder class.
- A salt value is used to add randomness to the key derivation process. In this case, a fixed salt value of 16 is used.
- The PBKDF2 algorithm is used to derive a key from the user's password and salt. The key is then used for AES-GCM encryption.
- Then finally, The derived key is exported and converted to a hexadecimal string for use in encryption and decryption. And the entry is saved by encrypting the password part of the entry with the generated key.
- For retrieval, a key is again derived from user's password via same process.
- Each of the password entry is decrypted from database.
- Locally populating the decrypted entries in the passwords localstorage item.
- Retrieval Over.

## How To Run Locally?

# How to Run it Locally?

- Clone this repo to your local system
- go to the env template file provided in the repo and paste your own api keys and mongodb uri to make it work in local host
- Rename env to .env in your system ( in frontend folder too )
- Open Two Terminals ( for better accessibility )
- In one of them write `npm install` or `npm i`
- In the other write `cd frontend` then `npm install` or `npm i`
- Then in the terminal where you are in the **frontend** folder, write `npm run dev` for the frontend
- And in the other terminal write `npm run dev:server` for the server


## Demo Video

https://github.com/user-attachments/assets/66852bf5-34c5-4776-8e65-d10d5638fad6

