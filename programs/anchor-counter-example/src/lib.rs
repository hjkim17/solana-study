use std::mem::size_of;

use anchor_lang::prelude::*;

declare_id!("Fg6PaFpoGXkYsidMpWTK6W2BeZ7FEfcYkg476zPFsLnS");

#[program]
pub mod anchor_counter_example {
    use super::*;

    pub fn initialize(ctx: Context<Initialize>) -> Result<()> {
        ctx.accounts.counter_account.count = 0;
        Ok(())
    }

    pub fn increment(
        ctx: Context<Increment>,
    ) -> Result<()> {
        let counter = &mut ctx.accounts.counter_account;
        counter.count = counter.count + 1;
        Ok(())
    }

    pub fn set(
        ctx: Context<Increment>,
        value: u64,
    ) -> Result<()> {
        let counter = &mut ctx.accounts.counter_account;
        counter.count = value;
        Ok(())
    }
}

#[derive(Accounts)]
pub struct Initialize<'info> {
    #[account(mut)]
    pub authority: Signer<'info>,
    #[account(
        init,
        payer = authority,
        space = 8 + size_of::<Counter>()
    )]
    pub counter_account: Box<Account<'info, Counter>>,
    pub system_program: Program<'info, System>,
}

// for increase count
#[derive(Accounts)]
pub struct Increment<'info> {
    #[account(mut)]
    pub counter_account: Box<Account<'info, Counter>>,
}

// for setting count to custom value
#[derive(Accounts)]
pub struct Set<'info> {
    #[account(mut)]
    pub counter_account: Box<Account<'info, Counter>>,
}

#[account]
pub struct Counter {
    pub count: u64,
}