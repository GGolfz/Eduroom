import Head from "next/head";
import React, { Fragment, useState, useEffect, useContext } from "react";
import {
  Link,
} from "@material-ui/core";

import style from "../../../styles/forum/showForum";
import General from "../../../components/template/general";
import Lifetime from "../../../components/support/gettingstarted/lifetimeaccess";
const lifetimeaccess = () => {
  return <Fragment>
    
      <General img='/images/supforumbg.svg'>
        
            <div
                style={{
                    display: "flex",
                    flex: "1 1 auto",
                    justifyContent: "space-between",
                }}
            >
            <div id="nav">
                    <div className="top">
                    <Link href='/support'>Eduroom Support
                    </Link><label style={{marginLeft:'20px',marginRight:'20px'}}>&gt;</label><Link href='/support/getstart'>Getting Started</Link>
                    <label style={{marginLeft:'20px',marginRight:'20px'}}>&gt;</label>Lifetime Access
                    
                    <Lifetime/>
                    </div>
                    
                </div>
                <style jsx>{style}</style>
                <style jsx>
                    {`
            #nav {
              width: 100%;
            }
            .form {
              display: flex;
              text-align: center;
            }
            .sub {
              display: flex;
              width: 100%;
              justify-content: center;
            }
            .inner {
              width: 25%;
            }
            .paper {
              margin: 5%;
            }
            .top {

                padding: 50px 70px 0px 70px;
            }
          `}
                </style>
                </div>
            </General>
  </Fragment>;
};
export default lifetimeaccess;
