import * as anchor from "@project-serum/anchor";
import { Program } from "@project-serum/anchor";
import { AnchorCounterExample } from "../target/types/anchor_counter_example";

describe("anchor-counter-example", () => {
  // Configure the client to use the local cluster.
  anchor.setProvider(anchor.AnchorProvider.env());


  let endpoint = anchor.getProvider().connection.rpcEndpoint;
  const connection = new anchor.web3.Connection(endpoint ,"confirmed");
  const program = anchor.workspace.AnchorCounterExample as Program<AnchorCounterExample>;

  it("Is initialized!", async () => {
    const authority_keypair = anchor.web3.Keypair.generate();
    let sig = await connection.requestAirdrop(authority_keypair.publicKey, 1000000000);
    
    const counter_account_keypair = anchor.web3.Keypair.generate();
    const program_id = program.programId;
    let initializeIx = await program.methods.initialize(
    ).accounts({
      authority: authority_keypair.publicKey,
      counterAccount: authority_keypair.publicKey,
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
    
    console.log("Your transaction signature", tx);
  });

  it("Is initialized!", async () => {
    const authority_keypair = anchor.web3.Keypair.generate();
    let sig = await connection.requestAirdrop(authority_keypair.publicKey, 1000000000);
    
    const counter_account_keypair = anchor.web3.Keypair.generate();
    const program_id = program.programId;
    let initializeIx = await program.methods.initialize(
    ).accounts({
    }).instruction();
    let tx = new anchor.web3.Transaction();
    tx.add(
      initializeIx
    );
    sig = await connection.sendTransaction(
      tx,
      [authority_keypair],
      { skipPreflight: false, preflightCommitment: "confirmed" }
    );
    await connection.confirmTransaction(sig, 'confirmed');
    
    console.log("Your transaction signature", tx);
  });

  // it("Is incremented!", async () => {
  //   // Add your test here.
  //   const tx = await program.methods.initialize().rpc();
  //   console.log("Your transaction signature", tx);
  // });
});
