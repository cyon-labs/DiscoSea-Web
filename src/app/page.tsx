"use client"

import React, { Component } from 'react';
import {PublicKey ,Connection, clusterApiUrl,Transaction,TransactionInstruction,SystemProgram, TransactionInstructionCtorFields} from '@solana/web3.js';
import { TOKEN_PROGRAM_ID,createAssociatedTokenAccountInstruction } from '@solana/spl-token';
import CORE from '@/components/CORE';
import * as bs58 from 'bs58';



const SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID: PublicKey = new PublicKey(
  'ATokenGPvbdGVxr1b2hvZbsiqW5xWH25efTNsLJA8knL',
);


let connection = new Connection(clusterApiUrl('devnet'));


//generate user_pda
let str = 'DISCOSEA_CORE';
let seeds = Buffer.from(str, 'utf-8');  // or 'ascii', 'base64', etc. depending on your needs


//programId
let programId = new PublicKey('4D8MVDaVsjreobtFyieujZHwfo6E8rMnVpKS1skzvCb7');
let copper_ore_mint = new PublicKey("9tzJM4VjujoHCWKWNtGrsR69iTTuyiasacKoFYYKxm5a");
let pda_copper_ore_account = new PublicKey('7qfrwfu1jMhdu59RryCERQhKV3VWDAczcFbaG4VrRJqY')


let provider : any;


let copper_bar_mint = new PublicKey("C64D6aTtmsKnjeqmyRZTKzWsdutQvraTmQbZujLLwGpp");


class Character {
  active: boolean = false;
  hpLvl: number = 0;
  mpLvl: number = 0;
  atkLvl: number =0;
  strLvl: number =0;
  defLvl: number=0;
  miningLvl: number=0;
  smithingLvl: number=0;
  mintingLvl: number=0;
  stakingLvl: number=0;

  // Deserialize a Uint8Array into an instance of the Character class
  static deserialize(data: Uint8Array): Character {
      const character = new Character();

      character.active = data[0] === 1;
      character.hpLvl = new DataView(data.buffer, 1, 4).getUint32(0, true);
      character.mpLvl = new DataView(data.buffer, 5, 4).getUint32(0, true);
      character.atkLvl = new DataView(data.buffer, 9, 4).getUint32(0, true);
      character.strLvl = new DataView(data.buffer, 13, 4).getUint32(0, true);
      character.defLvl = new DataView(data.buffer, 17, 4).getUint32(0, true);
      character.miningLvl = new DataView(data.buffer, 21, 4).getUint32(0, true);
      character.smithingLvl = new DataView(data.buffer, 25, 4).getUint32(0, true);
      character.mintingLvl = new DataView(data.buffer, 29, 4).getUint32(0, true);
      character.stakingLvl = new DataView(data.buffer, 33, 4).getUint32(0, true);

      return character;
  }
}

class TokenAccount {
  mint: Uint8Array = new Uint8Array([0]);
  owner: Uint8Array = new Uint8Array([0]);
  tokenBalance: bigint = BigInt(0);  delegate?: Uint8Array | null; // Optional, so can be undefined or null
  state: AccountState = AccountState.Uninitialized; // This would need to be another type or enum you define
  isNative?: bigint | null; // Optional, indicating a u64 or none
  delegatedAmount?: bigint;
  closeAuthority?: Uint8Array | null; 

  static deserialize(data: Uint8Array): TokenAccount {
      const account = new TokenAccount();

      account.mint = data.slice(0, 32);
      account.owner = data.slice(32, 64);
      account.tokenBalance = new DataView(data.buffer, 64, 8).getBigUint64(0, true);
      // Assuming delegate is the next 32 bytes, but you might adjust based on COption's actual representation
      account.delegate = data.slice(72, 104).every(byte => byte === 0) ? null : data.slice(72, 104);
      // Assuming state is a byte, adjust as needed
      account.state = data[104];
      // Assuming isNative is the next 8 bytes as u64, but adjust based on COption's representation
      account.isNative = new DataView(data.buffer, 105, 8).getBigUint64(0, true) || null;
      account.delegatedAmount = new DataView(data.buffer, 113, 8).getBigUint64(0, true);
      // Assuming closeAuthority is the next 32 bytes, adjust based on COption's representation
      account.closeAuthority = data.slice(121, 153).every(byte => byte === 0) ? null : data.slice(121, 153);

      return account;
  }
}


enum AccountState {
  // Populate with the possible states, e.g., 
  Initialized, 
  Uninitialized,
  // ... other states ...
}




class page extends Component {
  state={
    loading:true,
    feePayer :null,
    hasCore:false,
    character: new Character(),
    user_pda:null,
    missingAccountInstructions:[],

    //resource accounts
    copper_ore_account:null,
    copper_bar_account:null,

    //bank items
    copper_ore_amount:0,
    copper_bar_amount:0,

  }


   findAssociatedTokenAddress(
    walletAddress: PublicKey,
    tokenMintAddress: PublicKey
  ): PublicKey {
      return PublicKey.findProgramAddressSync(
          [
              walletAddress.toBuffer(),
              TOKEN_PROGRAM_ID.toBuffer(),
              tokenMintAddress.toBuffer(),
          ],
          SPL_ASSOCIATED_TOKEN_ACCOUNT_PROGRAM_ID
      )[0];
  }



  async walletClick()
  {
    var walletButton = document.getElementById("WalletButton");


    if(walletButton!==null)
    {
  
    }else{
      alert("Error in Wallet")
      return 0
    }
    try {

        if(walletButton.innerHTML.length==9)
        {
          console.log("Connected Here")
          provider.disconnect();
          walletButton.innerHTML ="Connect Wallet"


        }else
        {
          const resp = await provider.connect();
          console.log(resp.publicKey.toString()); 
          walletButton.innerHTML = resp.publicKey.toString().slice(0,3) + "..." + resp.publicKey.toString().slice(-3) 

        }

    } catch (err) {
        // { code: 4001, message: 'User rejected the request.' }
    }


  
  }




  async getProvider(){
    if ('phantom' in window) {
      const provider = window.phantom?.solana;
  
      if (provider?.isPhantom) {
        return provider;
      }
    }
  
    window.open('https://phantom.app/', '_blank');
  };

  async getOrCreateUserAccountInstructions(mint:PublicKey,feePayer:PublicKey)
  {


        //getting user accounts
        let ata = await  this.findAssociatedTokenAddress(feePayer, mint);
        console.log("ATA:"+ata.toBase58())

        
        // Get account info
        let accountInfo = await connection.getAccountInfo(ata);

        // Check if account exists
        if (accountInfo === null) {
            console.log("Account does not exist.");
            let associatedTokenInstruction = createAssociatedTokenAccountInstruction(
              feePayer, // payer
              ata, // ata
              feePayer, // owner
              mint // mint
            )
  
            console.log(associatedTokenInstruction)

            return associatedTokenInstruction




        } else {
            console.log("SPL Account exists.");
            console.log(accountInfo)
            const tokenAccount = TokenAccount.deserialize(accountInfo.data);
            // Access the properties of the token account
            console.log(bs58.encode(tokenAccount.mint));
            console.log(bs58.encode(tokenAccount.owner));
            console.log(tokenAccount.tokenBalance);

            this.setState({copper_ore_account:ata,copper_ore_ammount:tokenAccount.tokenBalance})



        }



  }


  async metaMine()
  {

    console.log("Checking User Mining Account")

    if(this.state.copper_ore_account==null)
    {
      console.log("User does not have a copper account")

    }else{
      console.log(this.state.copper_ore_account)
      let [pdaPublicKey, _nonce] = await PublicKey.findProgramAddressSync([seeds], programId);


      var iX = 2;
      var iXBuffer = Buffer.alloc(1);
      iXBuffer.writeUint8(iX);

      var nonceBuffer = Buffer.alloc(1);
      nonceBuffer.writeUint8(_nonce);
    
      var dataBuffer = Buffer.concat([iXBuffer,seeds,nonceBuffer]);


    
      // Create the instruction to send data
      let instructionData:TransactionInstructionCtorFields = {
        keys: [
          // @ts-ignore
          { pubkey: this.state.feePayer, isSigner: true, isWritable: false },
          { pubkey: pdaPublicKey, isSigner: false, isWritable: false },

          //resource mint and accounts
          { pubkey: copper_ore_mint, isSigner: false, isWritable: true },
          { pubkey: this.state.copper_ore_account, isSigner: false, isWritable: true },
          { pubkey: pda_copper_ore_account, isSigner: false, isWritable: true },

          { pubkey: SystemProgram.programId, isSigner: false, isWritable: false },
          { pubkey: TOKEN_PROGRAM_ID, isSigner: false, isWritable: false },
          // @ts-ignore
          { pubkey: this.state.user_pda, isSigner: false, isWritable: false }],
        programId:programId,
        data: dataBuffer,
      };
      let sendDataIx = new TransactionInstruction(instructionData);


      this.sendGameTransaction([sendDataIx])





    }

  }


async create_user_pda_account()
{

  let user_pda = this.state.user_pda;
  let feePayer = this.state.feePayer;


  var iX = 1;
  var iXBuffer = Buffer.alloc(1);
  iXBuffer.writeUint8(iX);

  var dataBuffer = Buffer.concat([iXBuffer]);

  var { blockhash } = await connection.getRecentBlockhash();

  // Create a transaction
  let transaction = new Transaction({
    feePayer: feePayer,
    recentBlockhash: blockhash,
  });

  console.log(feePayer)
  console.log(user_pda)
  console.log(SystemProgram.programId)


  // Create the instruction to send data
  let instructionData:TransactionInstructionCtorFields = {
    keys: [
      // @ts-ignore
      { pubkey: feePayer, isSigner: true, isWritable: false },
      // @ts-ignore
      { pubkey: user_pda, isSigner: false, isWritable: true },
      { pubkey: SystemProgram.programId, isSigner: false, isWritable: false }],
    programId:programId,
    data: dataBuffer,
  };
  let sendDataIx = new TransactionInstruction(instructionData);

  // Send the transaction
  transaction
    .add(sendDataIx)



    let missingAccounts = []

    //copper ore
    // @ts-ignore
    const accountInstructions = await this.getOrCreateUserAccountInstructions(copper_ore_mint, this.state.feePayer);
    if (accountInstructions) {
        missingAccounts.push(accountInstructions);
    }

    for (let index = 0; index < missingAccounts.length; index++) {
      transaction.add(missingAccounts[index])
      
    }

  
  try {
    var signedTransaction = await provider.signTransaction(transaction);
    //transaction.sign(feePayerAccount)
  
    var rawTransaction = signedTransaction.serialize();
  
    var transactionId = connection.sendRawTransaction(rawTransaction,{"skipPreflight":true});
  
    console.log(transactionId)
  
  
    // var transactionId = await connection.sendTransaction(transaction, [feePayerAccount], { skipPreflight: true });
  
  
    console.log(`https://explorer.solana.com/tx/${transactionId}?cluster=devnet`)


    let character = new Character();
    let newAccountArray=new Uint8Array([1,130,4,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0])
    character = Character.deserialize(newAccountArray);
    this.setState({character:character})


    // character.active = 1;
    // character.hpLvl = new DataView(data.buffer, 1, 4).getUint32(0, true);
    // character.mpLvl = new DataView(data.buffer, 5, 4).getUint32(0, true);
    // character.atkLvl = new DataView(data.buffer, 9, 4).getUint32(0, true);
    // character.strLvl = new DataView(data.buffer, 13, 4).getUint32(0, true);
    // character.defLvl = new DataView(data.buffer, 17, 4).getUint32(0, true);
    // character.miningLvl = new DataView(data.buffer, 21, 4).getUint32(0, true);
    // character.smithingLvl = new DataView(data.buffer, 25, 4).getUint32(0, true);
    // character.mintingLvl = new DataView(data.buffer, 29, 4).getUint32(0, true);
    // character.stakingLvl = new DataView(data.buffer, 33, 4).getUint32(0, true);


    // this.setState({
    //   character: Character.deserialize(newCharacterData)
    // });




    
  } catch (error) {

    console.log(error)
    
  }




}




async sendGameTransaction(InstructionArray:TransactionInstruction[])
{
  

  var { blockhash } = await connection.getRecentBlockhash();

  // Create a transaction
  let transaction = new Transaction({
    feePayer: this.state.feePayer,
    recentBlockhash: blockhash,
  });


  for (let index = 0; index < InstructionArray.length; index++) {
   transaction.add(InstructionArray[index]);
    
  }


  try {
    var signedTransaction = await provider.signTransaction(transaction);
    //transaction.sign(feePayerAccount)
  
    var rawTransaction = signedTransaction.serialize();
  
    var transactionId = connection.sendRawTransaction(rawTransaction,{"skipPreflight":true});
  
    console.log(transactionId)
    
  
    console.log(`https://explorer.solana.com/tx/${transactionId}?cluster=devnet`)

    
  } catch (error) {

    console.log(error)
    
  }
}


  async componentDidMount() {
    console.log("App Loaded")

    
    provider = await this.getProvider()
    
    console.log(provider)

      try {
        const resp = await provider.connect();
        console.log("FeePayer:"+resp.publicKey.toString());

        
        let walletButton = document.getElementById("WalletButton");

        if(walletButton!==null)
        {
          walletButton.innerHTML = resp.publicKey.toString().slice(0,3) + "..." + resp.publicKey.toString().slice(-3) 

          let feePayer = new PublicKey(resp.publicKey.toString())



          // derive the user_pda address for the user
          let [user_pda, _nonce] = await PublicKey.findProgramAddressSync(
            [feePayer.toBuffer()],
            programId,
          );

          console.log(user_pda)

          this.setState({user_pda:user_pda,feePayer:feePayer},()=>{
            console.log(this.state)
          })


          // Get account info
          let accountInfo = await connection.getAccountInfo(user_pda);

          // Check if account exists
          if (accountInfo === null) {
              console.log("Account does not exist.");

              this.setState({loading:false})

              
         
  
          } else {
              console.log("Account exists.");
              console.log(accountInfo)




              this.getOrCreateUserAccountInstructions(copper_ore_mint,feePayer)




              try {
                const char = Character.deserialize(accountInfo.data);
                console.log(char);
                this.setState({character:char,hasCore:true,loading:false},()=>{
                  console.log(this.state.character.hpLvl)
                })
                
              } catch (error) {
                console.log(error)
                
              }

          }


          return 0




        }
        
      } catch (error) {
        
      }


    
  }




    


  render() {

      return (

        <div>
  
               

                          <CORE 
                          character={this.state.character}  
                          hasCore={this.state.hasCore} 
                          // @ts-ignore
                          create_user_pda_account={this.create_user_pda_account.bind(this)}
                          metaMine = {this.metaMine.bind(this)}
                          loading={this.state.loading}  
                          copper_ore_ammount={this.state.copper_bar_amount}                        
                          /> 
                        
  
          <button style={{position:"fixed",right:20,width:200,height:60,top:20}} id="WalletButton">Connect Wallet</button>
  
  
  
  
  <div className="video-container">
            <iframe className="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/TErXeteI7g0" title="YouTube video player" frameBorder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowFullScreen></iframe>
            <div className="buttons-container">
                <button onClick={()=>{window.open("https://drive.google.com/drive/folders/11vXfEo5EEm9fkfcMgdBekyxjDWWiLr9A?usp=drive_link","_target")}} className="download-button">Download for Windows</button>
                <button onClick={()=>{window.open("https://drive.google.com/drive/folders/11vXfEo5EEm9fkfcMgdBekyxjDWWiLr9A?usp=drive_link","_target")}}className="download-button">Download for Mac</button>
                <button onClick={()=>{alert("DM @azuldev about a mobile demo")}} className="download-button">Download for iOS</button>
                <button onClick={()=>{alert("DM @azuldev about a mobile demo")}} className="download-button">Download for Android</button>
                <button onClick={()=>{window.open("https://discord.gg/4HUnPFz4Yu","_target")}} className="download-button">Discord</button>
                <button onClick={()=>{window.open("https://t.me/+VvS5PSSYBT5mNDVh","_target")}} className="download-button">Telegram</button>
                <button onClick={()=>{window.open("https://twitter.com/disco_sea","_target")}} className="download-button">Twitter</button>
                <button onClick={()=>{alert("Coming Soon")}} className="download-button">Twitch</button>
            </div>
        </div>
          
  
        <div style={{backgroundColor:"#000000"}} className="grid-container">
        <div className="image-container">
            <img src="https://media.discordapp.net/attachments/1134919950973288639/1136838212413833276/azuldev_isometric_futuristic_miner_with_armor_and_a_pick_axe_pi_2c0bc1d1-85e3-451c-8744-49a7b4614ea7.png?width=621&height=621"></img>
        </div>
  
        <div style={{marginLeft:-300}}>
          <div style={{color:"white"}}>DiscoSea CORE Leveling System</div>
          <button  onClick={()=>{alert("Web Demo Coming Soon")}}>Mine</button>
          <button  onClick={()=>{alert("Web Demo Coming Soon")}}>Smith</button>
          <button  onClick={()=>{alert("Web Demo Coming Soon")}}>Duel</button>
  
        </div>
          </div>
  
  
{/*   
  <div style={{backgroundColor:"#000000"}} className="grid-container">
  <div className="image-container">
            <img src="https://media.discordapp.net/attachments/1134919950973288639/1136848122140696676/azuldev_isometric_futuristic_Smither_with_anvil_pitch_black_bac_0ed8d744-d39c-46f4-a807-763952cf5eb0.png?width=621&height=621"></img>
        </div>
  
  <div style={{marginLeft:-300}}>
          <div style={{color:"white"}}>Smithing</div>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
  
        </div>
  
        
  
  
  
  
  </div>
  
  <div style={{backgroundColor:"#000000"}} className="grid-container">
  <div className="image-container">
            <img src="https://media.discordapp.net/attachments/1134919950973288639/1136850473857597452/azuldev_isometric_futuristic_candy_machine_pitch_black_backgrou_a8e3e873-cece-46ab-9fff-442d74d121c1.png?width=621&height=621"></img>
        </div>
  
  <div style={{marginLeft:-300}}>
          <div style={{color:"white"}}>Metaplex Mint</div>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
  
        </div>
  
        
  
  
  
  
  </div>
  
  
  <div style={{backgroundColor:"#000000"}} className="grid-container">
  <div className="image-container">
            <img src="https://media.discordapp.net/attachments/1134919950973288639/1136850755689648238/azuldev_isometric_futuristic_steam_machine_protected_by_robots__9b114632-7583-4578-b61a-d221d3809df4.png?width=621&height=621"></img>
        </div>
  
  <div style={{marginLeft:-300}}>
          <div style={{color:"white"}}>SolBlaze Stake</div>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
  
        </div>
  
        
  
  
  
  
  </div>
  
  
  <div style={{backgroundColor:"#000000"}} className="grid-container">
  <div className="image-container">
            <img src="https://media.discordapp.net/attachments/1134919950973288639/1136850705441902592/azuldev_isometric_futuristic_sword_duel_grounds_pitch_black_bac_a4f32c6a-5d40-406d-a5a3-3357e3be0eb6.png?width=621&height=621"></img>
        </div>
  
  <div style={{marginLeft:-300}}>
          <div style={{color:"white"}}>CORE Combat</div>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
  
        </div>
  
  </div>
  
  
  <div style={{backgroundColor:"#000000"}} className="grid-container">
  <div className="image-container">
            <img src="https://media.discordapp.net/attachments/1134919950973288639/1136850705441902592/azuldev_isometric_futuristic_sword_duel_grounds_pitch_black_bac_a4f32c6a-5d40-406d-a5a3-3357e3be0eb6.png?width=621&height=621"></img>
        </div>
  
  <div style={{marginLeft:-300}}>
          <div style={{color:"white"}}>Lunamar Comic Book</div>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
          <button>Hello</button>
  
        </div>
  
  </div>
  
   */}
  
  
  
       </div>
    
  
  
  
      );

    }


}

export default page;