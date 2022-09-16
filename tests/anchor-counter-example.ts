import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { BN } from "bn.js";
import { AnchorCounterExample } from "../target/types/anchor_counter_example";

describe("anchor-counter-example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());


  let endpoint = anchor.getProvider().connection.rpcEndpoint;
  const connection = new anchor.web3.Connection(endpoint ,"confirmed");
  const program = anchor.workspace.AnchorCounterExample as Program<AnchorCounterExample>;

  const authority_keypair = anchor.web3.Keypair.generate();
  const counter_account_keypair = anchor.web3.Keypair.generate();
  let sig;
  it("Is initialized!", async () => {
    sig = await connection.requestAirdrop(authority_keypair.publicKey, 1000000000);
    await new Promise(f => setTimeout(f, 1000));
    
    let initializeIx = await program.methods.initialize(
    ).accounts({
      authority: authority_keypair.publicKey,
      counterAccount: counter_account_keypair.publicKey,
      systemProgram: anchor.web3.SystemProgram.programId
    }).instruction();
    let tx = new anchor.web3.Transaction();
    tx.add(
      initializeIx
    );
    sig = await connection.sendTransaction(
      tx,
      [authority_keypair, counter_account_keypair],
      { skipPreflight: false, preflightCommitment: "confirmed" }
    );
    await connection.confirmTransaction(sig, 'confirmed');

    let counter = await program.account.counter.fetch(counter_account_keypair.publicKey);
    console.log(
      `count of the Count structure ${counter_account_keypair.publicKey.toBase58()}:`,
      counter.count.toString()
    );
    
    // console.log("Your transaction signature", tx);
  });

  it("Is incremented!", async () => {
    // Add your test here.

    let incrementIx = await program.methods.increment(
    ).accounts({
      counterAccount: counter_account_keypair.publicKey,
    }).instruction();
    let tx = new anchor.web3.Transaction();
    tx.add(
      incrementIx
    );
    sig = await connection.sendTransaction(
      tx,
      [authority_keypair],
      { skipPreflight: false, preflightCommitment: "confirmed" }
    );
    await connection.confirmTransaction(sig, 'confirmed');
    
    let counter = await program.account.counter.fetch(counter_account_keypair.publicKey);
    console.log(
      `count of the Count structure ${counter_account_keypair.publicKey.toBase58()}:`,
      counter.count.toString()
    );
    // console.log("Your transaction signature", tx);
  });

  it("Is set!", async () => {
    // Add your test here.

    let setIx = await program.methods.set(
      new BN(12)
    ).accounts({
      counterAccount: counter_account_keypair.publicKey,
    }).instruction();
    let tx = new anchor.web3.Transaction();
    tx.add(
      setIx
    );
    sig = await connection.sendTransaction(
      tx,
      [authority_keypair],
      { skipPreflight: false, preflightCommitment: "confirmed" }
    );
    await connection.confirmTransaction(sig, 'confirmed');

    let counter = await program.account.counter.fetch(counter_account_keypair.publicKey);
    console.log(
      `count of the Count structure ${counter_account_keypair.publicKey.toBase58()}:`,
      counter.count.toString()
    );
    // console.log("Your transaction signature", tx);
  });
});
