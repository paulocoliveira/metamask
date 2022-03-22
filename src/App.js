import { ethers } from "ethers";
import React, { useState } from "react";
import Button from "@material-ui/core/Button";
import TextField from "@material-ui/core/TextField";
import Typography from "@material-ui/core/typography";
import AlertTitle from "@material-ui/lab/AlertTitle";
import Alert from "@material-ui/lab/Alert";
import Link from '@material-ui/core/Link';

function App() {

  const [message, setMessage] = useState("");
  const [account, setAccount] = useState([]);
  const [balance, setBalance] = useState("");
  const [transferTransaction, setTransferTransaction] = useState("");
  const [result, setResult] = useState("");
  const [status, setStatus] = useState(false);
  const [error, setError] = useState(false);

  let provider;

  async function checkAndConnect(){
    if(!window.ethereum){
        return setMessage("Metamask is not installed!");
    }
    
    setMessage("Trying to connect...");

    try {
        await window.ethereum.send("eth_requestAccounts");

        provider = new ethers.providers.Web3Provider(window.ethereum);

        const accountList = await provider.listAccounts();
        const mainAccount = accountList[0];
        setAccount(mainAccount)
        setStatus(true)
        setMessage("Connected to account: " + mainAccount)
    } catch (error) {
        setError(true)
        setMessage(error.message)
    }
  }
  
  async function getBalance(){
    checkAndConnect()
    
    provider = new ethers.providers.Web3Provider(window.ethereum);

    const accountBalance = await provider.getBalance(account)
    console.log(accountBalance)
    setBalance(ethers.utils.formatEther(accountBalance.toString()))
  }

  async function transfer(){
    checkAndConnect()

    provider = new ethers.providers.Web3Provider(window.ethereum);

    const signer = provider.getSigner();

    
    try {
        setError(false)
        ethers.utils.getAddress(transferTransaction.toAddress)
        console.log(transferTransaction)
        const transaction = await signer.sendTransaction({
            to: transferTransaction.toAddress,
            value: ethers.utils.parseEther(transferTransaction.transferValue.replace(",", "."))
        })
        setResult(transaction)
    } catch (error) {
        setError(true)
        setResult(error.message)      
    }
  }

  function onInputChange(event){
    setTransferTransaction(prevState => ({ ...prevState, [event.target.id]: event.target.value }));
}

  return (
    <div className="App">
        <div>
            <Typography variant="h4" component="h2">
                Metamask Sample
            </Typography>
        </div>
        <div>
            <br />
            <Button variant="contained" color="primary" onClick={evt => checkAndConnect()} >
                Connect
            </Button>
        </div>
        {
            !status
            ? <React.Fragment></React.Fragment>
            : <React.Fragment>
                <br />
                <Alert severity="success">
                    <AlertTitle>Success</AlertTitle>
                    {message}
                </Alert>
            </React.Fragment>
        }
        {
            error && !result
            ? <React.Fragment>
                <br />
                <Alert severity="error">
                    <AlertTitle>Error</AlertTitle>
                    {message}
                </Alert>
            </React.Fragment>
            : <React.Fragment></React.Fragment>
        }
        {
            status
            ? <React.Fragment>
                <br />
                <div>
                    <Button variant="contained" color="primary" onClick={evt => getBalance()} >
                        Get Balance
                    </Button>
                </div>
            </React.Fragment>
            : <React.Fragment></React.Fragment>
        }
        {
            !balance
            ? <React.Fragment></React.Fragment>
            : <React.Fragment>
                <br />
                <Alert severity="info">
                    <AlertTitle>Balance</AlertTitle>
                    {balance}
                </Alert>
            </React.Fragment>
        }
        {
            !balance
            ? <React.Fragment></React.Fragment>
            : <React.Fragment>
                <br />
                <Typography variant="h7" component="h2">
                    Transfer Balance
                </Typography>
                <div>
                    <TextField id="toAddress" label="Receiver Address" onChange={onInputChange} />
                </div>
                <br />
                <div>
                    <TextField id="transferValue" label="Value" onChange={onInputChange} />
                </div>
                <br />
                <div>
                    <Button variant="contained" color="primary" onClick={evt => transfer()} >
                        Transfer
                    </Button>
                </div>
                {
                    !result
                    ? <React.Fragment></React.Fragment>
                    : 
                        error
                        ? <React.Fragment>
                            <br />
                            <Alert severity="error">
                                <AlertTitle>Error</AlertTitle>
                                {result}
                            </Alert>
                        </React.Fragment>
                        : <React.Fragment>
                            <br />
                            <Alert severity="success">
                                <AlertTitle>Success</AlertTitle>
                                Transfer was done successfully! 
                                Transaction Hash: {result.hash}
                            </Alert>
                        </React.Fragment>
                }
            </React.Fragment>
        }
        </div>
  );
}

export default App;
