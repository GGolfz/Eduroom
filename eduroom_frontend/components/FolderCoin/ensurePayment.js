import Card from '@material-ui/core/Card';
import { useState } from 'react';
import Styles from '../../styles/CoinStyles/ensurePayment.module.css';
import SuccessPop from '../FolderCoin/Success-popup';
import {Dialog, DialogContent} from '@material-ui/core';

const ensurePay = (props) => {
    const [state,setState]=useState(false);
    const SuccessPurchase =()=>{
        setState(true)
    }
    return (
        <div className={Styles.cardPay}>
            <h2 className={Styles.topic}>
                Are you ensure to pay sticker?
            </h2>
            <div className={Styles.select}>
                <div>
                <button onClick={SuccessPurchase}>
                    Yes
                </button>
                <Dialog  open={state}>
                    <DialogContent style={{width:'500px',height:'500px'}}>
                        <SuccessPop close={()=>{ props.closeEnsure(); setState(false)}}/>
                    </DialogContent>
                </Dialog>
                </div>
                <button onClick={props.close}>
                    No
                </button>
            </div>


        </div>
    )
}
export default ensurePay;