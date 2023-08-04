"use client"

import React, { Component } from 'react';


let provider : any;

class page extends Component {



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
        }
        
      } catch (error) {
        
      }


    
      }

    


  render() {
    return (

      <div>

        <button style={{position:"fixed",right:20,width:200,height:60,top:20}} id="WalletButton">Connect Wallet</button>

<div className="video-container">
          <iframe className="youtube-video" width="560" height="315" src="https://www.youtube.com/embed/TErXeteI7g0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
          <div className="buttons-container">
              <button className="download-button">Download for Windows</button>
              <button className="download-button">Download for Mac</button>
              <button className="download-button">Download for iOS</button>
              <button className="download-button">Download for Android</button>
              <button className="download-button">Discord</button>
              <button className="download-button">Telegram</button>
              <button className="download-button">Twitter</button>
              <button className="download-button">Twitch</button>
          </div>
      </div>
        

<div style={{backgroundColor:"#000000"}} className="grid-container">
      <div className="image-container">
          <img src="https://media.discordapp.net/attachments/1134919950973288639/1136838212413833276/azuldev_isometric_futuristic_miner_with_armor_and_a_pick_axe_pi_2c0bc1d1-85e3-451c-8744-49a7b4614ea7.png?width=621&height=621"></img>
      </div>

      <div style={{marginLeft:-300}}>
        <div style={{color:"white"}}>DiscoSea CORE Leveling System</div>
        <button>Hello</button>
        <button>Hello</button>
        <button>Hello</button>
        <button>Hello</button>

      </div>
</div>


<div style={{backgroundColor:"#000000"}} className="grid-container">
<div style={{marginLeft:-300}}>
        <div style={{color:"white"}}>Mining</div>
        <button>Hello</button>
        <button>Hello</button>
        <button>Hello</button>
        <button>Hello</button>

      </div>
      <div className="image-container">
          <img src="https://media.discordapp.net/attachments/1134919950973288639/1136847078698520586/azuldev_isometric_futuristic_miner_with_armor_and_a_pick_axe_pi_12dcedc0-758a-40a8-a014-4df436ec7bc3.png?width=621&height=621"></img>
      </div>


</div>


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








      </div>
  



    );
  }
}

export default page;