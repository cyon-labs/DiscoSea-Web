"use client"

import React, { Component } from 'react';

type COREProps = {
    loading: boolean;
    hasCore: boolean;
    copper_ore_ammount:number;
    create_pda_account: () => void;
    character: {
      hpLvl: number;
      mpLvl: number;
      atkLvl: number;
      strLvl: number;
      defLvl: number;
      miningLvl: number;
      smithingLvl: number;
      mintingLvl: number;
      stakingLvl: number;
    };
    metaMine: () => void;
  };

class CORE extends Component<COREProps> {
    render() {


        if(this.props.loading==true)
        {

           return <div style={{color:"white"}}>Loading...</div>

        }else{

            if(!this.props.hasCore)
            {
                return (
           
                    <button onClick={this.props.create_user_pda_account} style={{marginTop:20}}>Create Account</button>
                );
    
            }else
            {
                return (

                    <div style={{backgroundColor:"#000000"}} className="grid-container">
                  <div>
                    <div>
                    <div style={{color:"white"}}>DiscoSea CORE lvl : ...</div>
                    <div style={{color:"white"}}>---Combat---</div>
    
                    <div style={{color:"white"}}>HP : {this.props.character.hpLvl}</div>
                    <div style={{color:"white"}}>MP :  {this.props.character.mpLvl}</div>
                    <div style={{color:"white"}}>ATK:  {this.props.character.atkLvl}</div>
                    <div style={{color:"white"}}>STR:  {this.props.character.strLvl}</div>
                    <div style={{color:"white"}}>DEF:  {this.props.character.defLvl}</div>
                    <div style={{color:"white"}}>---skills---</div>
                    <div style={{color:"white"}}>Minning:  {this.props.character.miningLvl}</div>
                    <div style={{color:"white"}}>Smithing:  {this.props.character.smithingLvl}</div>
                    <div style={{color:"white"}}>Metaplex Minting:  {this.props.character.miningLvl}</div>
                    <div style={{color:"white"}}>SolBlaze Staking:  {this.props.character.stakingLvl}</div>
                    <div style={{color:"white"}}>---bank---</div>
                    <div style={{color:"white"}}>copper ore: {this.props.copper_ore_ammount}</div>
                    <div style={{color:"white"}}>copper bar:</div>
                </div>
                    <button onClick={this.props.metaMine} style={{marginTop:20}}>Mine</button>
                    <button style={{marginTop:20}}>Smith</button>
                    <button style={{marginTop:20}}>Duel</button>

                  </div>

                  <div className="image-container">
                              <img src="https://media.discordapp.net/attachments/1134919950973288639/1136847078698520586/azuldev_isometric_futuristic_miner_with_armor_and_a_pick_axe_pi_12dcedc0-758a-40a8-a014-4df436ec7bc3.png?width=621&height=621"></img>
                          </div>
  
                     
  
                      </div>
  
    
    
                );
    
            }
    

        }





    }
}

export default CORE;