// We're using React Context API around our application so that it's connected to the blockchain.
// This allows us not to write our logic all around our components and centralizing it here. 

import React, { useEffect, useState } from 'react';
import { ethers } from 'ethers';

import { contractABI, contractAddress } from '../utils/constants';

export const TransactionContext = React.createContext();

const { ethereum } = window;
// We're using MetaMask and getting access to the ethereum object.
// We're basically destructuring window.ethereum

const getEthereumContract = () => {
// This function fetches our ethereum contract

    const provider = new ethers.providers.Web3Provider(ethereum);
    const signer = provider.getSigner();
    const transactionContract = new ethers.Contract(contractAddress, contractABI, signer);

    return transactionContract;
}

export const TransactionProvider = ({ children }) => {
    const [currentAccount, setCurrentAccount] = useState('');
    const [formData, setFormData] = useState({ addressTo: '', amount: '', keyword: '', message: ''});
    const [isLoading, setIsLoading] = useState(false);
    const [transactionCount, setTransactionCount] = useState(localStorage.getItem('transactionCount'));
    // We don't want the count to reset everytime the page is re-loaded so we store it in localStorage.
    const [transactions, setTransactions] = useState([]);

    // This function receives data from the welcome page form inputs.
    const handleChange = (e, name) => {
        setFormData((prevState) => ({ ...prevState, [name]: e.target.value }));
    }

    // getAllTransactions is a special function we wrote on our smart contract.
    const getAllTransactions = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");
            const transactionContract = getEthereumContract();

            const availableTransactions = await transactionContract.getAllTransactions();

            // "structuredTransactions" organizes the availableTransactions data.
            const structuredTransactions = availableTransactions.map((transaction) => ({
                addressTo: transaction.receiver,
                addressFrom: transaction.sender,
                timestamp: new Date(transaction.timestamp.toNumber() * 1000).toLocaleString(),
                message: transaction.message,
                keyword: transaction.keyword,
                amount: parseInt(transaction.amount._hex) / (10 ** 18)
                // To get the amount in eth, we divide the "amount" to 10 to the power of 18 because it's shown in hex GWEI.
            }))

            console.log(structuredTransactions);
            setTransactions(structuredTransactions);
        } catch (error) {
            console.log(error)
        }
    }

    //The first thing we need to know is if the users have their MetaMask connected so that we can do everything we want to do. 
    const checkIfWalletisConnected = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const accounts = await ethereum.request({method: 'eth_accounts' });

            if(accounts.length) {
                setCurrentAccount(accounts[0]);

                getAllTransactions();
            } else {
                console.log('No accounts found');
            }
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    // This retrieves the list of all transactions sent accross our network.
    const checkIfTransactionsExist = async () => {
        try {
            const transactionContract = getEthereumContract();
            const transactionCount = await transactionContract.getTransactionCount();

            window.localStorage.setItem("transactionCount", transactionCount)
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    //If there's no wallet connected, users can click "Connect wallet" and have their MetaMask wallet connected.
    const connectWallet = async () => {
        try {
            if(!ethereum) return alert("Please install MetaMask");

            const accounts = await ethereum.request({method: 'eth_requestAccounts' });

            setCurrentAccount(accounts[0]);
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    // Our most important function that sends transactions and store them.
    // We first check if there's a MetaMask wallet connected, then we get the data from the welcome page form.
    // Then we need to get access to the ethereum contract.
    const sendTransaction = async () => {
        try {
            if(!ethereum) return alert("Please install metamask");

            const { addressTo, amount, keyword, message } = formData;
            const transactionContract = getEthereumContract(); 
            // With the variable above we can call all of our contract related functions.
            const parsedAmount = ethers.utils.parseEther(amount);
            // The ethers package provides this utility function that parses the decimal amount into GWEI hex amounts.

            // Now we can send eth with the request below.
            // All values in the ethereum network is written in hexadecimals so we need to convert them.
            // Here "gas" is expressed in GWEI hex, a sub unit of ether.
            await ethereum.request({
                method: 'eth_sendTransaction',
                params: [{
                    from: currentAccount,
                    to: addressTo,
                    gas: '0x5208', // 21000 GWEI = 0.000021 eth
                    value: parsedAmount._hex, // 0.001
                }]
            });

            // After sending our transaction, we also want to store it in the blockchain.
            // "addToBlockchain" is our own function we created in our smart contract.
            // Because the transaction takes time to go through, we create a loading state.
            const transactionHash = await transactionContract.addToBlockchain(addressTo, parsedAmount, message, keyword);

            setIsLoading(true);
            console.log(`Loading - ${transactionHash.hash}`);
            await transactionHash.wait();
            // This will wait for the transaction to be finished.
            setIsLoading(false);
            console.log(`Success - ${transactionHash.hash}`);

            // After the transaction is finished, we get the transactionCount and store it in the state.
            const transactionCount = await transactionContract.getTransactionCount();
            
            setTransactionCount(transactionCount.toNumber());   
            
            window.reload();
        } catch (error) {
            console.log(error);

            throw new Error("No ethereum object.")
        }
    }

    useEffect(() => {
        checkIfWalletisConnected();
        checkIfTransactionsExist();
    },[transactionCount]);

    // We're wrapping our entire React application with all of the data we're passing into it.
    // We import this TransactionProvider on our main.jsx file and wrap our application with a TransactionProvider tag.
    // That way our entire application has access to the data ("value" below) we pass in this file.
    return (
        <TransactionContext.Provider value={{
            connectWallet,
            currentAccount,
            formData,
            setFormData,
            handleChange,
            sendTransaction,
            transactions,
            isLoading
        }}>
            {children}
        </TransactionContext.Provider>
    )
}