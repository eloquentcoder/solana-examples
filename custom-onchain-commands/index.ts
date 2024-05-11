import { Connection, LAMPORTS_PER_SOL, PublicKey, Transaction, TransactionInstruction, TransactionInstructionCtorFields, clusterApiUrl, sendAndConfirmTransaction } from "@solana/web3.js";
import { getKeypairFromEnvironment, airdropIfRequired } from '@solana-developers/helpers';

import { config } from "dotenv";

config();

const payer = getKeypairFromEnvironment("SECRET_KEY");
const connection = new Connection(clusterApiUrl("devnet"), "confirmed");

const newBalance = await airdropIfRequired(
    connection,
    payer.publicKey,
    1 * LAMPORTS_PER_SOL,
    0.2 * LAMPORTS_PER_SOL
)


const PING_PROGRAM_ADDRESS = 'ChT1B39WKLS8qUrkLvFDXMhEJ4F1XZzwUNHUt4AU9aVa'
const PING_PROGRAM_DATA_ADDRESS = 'Ah9K7dQ8EHaZqcAsgBW8w37yN2eAy3koFmUn4x3CJtod'

const transaction = new Transaction()
const programId = new PublicKey(PING_PROGRAM_ADDRESS)
const pingProgramDataId = new PublicKey(PING_PROGRAM_DATA_ADDRESS)

const instruction = new TransactionInstruction({
    keys: [
        {
            pubkey: pingProgramDataId,
            isSigner: false,
            isWritable: true
        }
    ],
    programId
})

transaction.add(instruction)

const signature = await sendAndConfirmTransaction(
    connection,
    transaction,
    [payer]
)

console.log(`✅ Transaction completed! Signature is ${signature}`)