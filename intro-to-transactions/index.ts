import * as dotenv from "dotenv";
import { airdropIfRequired, getKeypairFromEnvironment } from '@solana-developers/helpers';
import { Connection, LAMPORTS_PER_SOL, PublicKey, SystemProgram, Transaction, sendAndConfirmTransaction } from "@solana/web3.js";
dotenv.config();

const supplyToPublicKey = process.argv[2] || null;

if (!supplyToPublicKey) {
    console.log(`Please provide a public key to send to`);
    process.exit(1);
}

const senderKey = getKeypairFromEnvironment("SECRET_KEY");

console.log(`Sender public key: ${senderKey.publicKey}`);

// FSEqTpsxQ8W3kyfb589gX335rrgDecU73RcbLELYgduR
const receiverKey = new PublicKey(supplyToPublicKey);

console.log(`Receiver key: ${receiverKey}`);

const connection = new Connection("https://api.devnet.solana.com", "confirmed");

console.log(
    `✅ Loaded our own keypair, the destination public key, and connected to Solana`
);

await airdropIfRequired(
    connection,
    senderKey.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.5 * LAMPORTS_PER_SOL,
);


const transaction = new Transaction();

const LAMPORTS_TO_SEND = parseInt(process.argv[3]) || 5000;

console.log(`We are sending ${LAMPORTS_TO_SEND} lamports`);

const sendSolInstruction = SystemProgram.transfer({
    fromPubkey: senderKey.publicKey,
    toPubkey: receiverKey,
    lamports: LAMPORTS_TO_SEND
});

transaction.add(sendSolInstruction);

const signature = await sendAndConfirmTransaction(connection, transaction, [senderKey])

console.log(
    `💸 Finished! Sent ${LAMPORTS_TO_SEND} to the address ${receiverKey.toBase58()}. `
);

console.log(`Balance of sender is now ${await connection.getBalance(senderKey.publicKey)}`);

console.log(`Balance of receiver is now ${await connection.getBalance(receiverKey)}`);

console.log(`Transaction signature is ${signature}!`);