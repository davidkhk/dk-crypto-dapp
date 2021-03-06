import React, { useContext } from 'react';

import { TransactionContext } from '../context/TransactionContext';

import dummyData from '../utils/dummyData';
// We used this dummyData to work on this section before having actual transactios data.
import { shortenAddress } from '../utils/shortenAddress';
import useFetch from '../hooks/useFetch';

const TransactionCard = ({ addressTo, addressFrom, timestamp, message, keyword, amount, url }) => {
    
    const gifUrl = useFetch({ keyword })

    // The transactionCard shows details of each transaction including a link to its etherscan page.
    // Each transaction is paired with a funny gif that is fetched from giphy.com API.
    return (
        <div className="bg-[#fff] m-4 flex flex-1
            2xl:min-w-[450px]
            2xl:max-w-[500px]
            sm:min-w-[270px]
            sm:max-w-[300px]
            flex-col p-3 rounded-md hover:shadow-2xl"
        >
            <div className="flex flex-col items-center w-full mt-3">
                <div className="w-full mb-6 p-2">
                    <a href={`https://ropsten.etherscan.io/address/${addressFrom}`} target="_blank" rel="noreferrer">
                        <p className="text-sky-700 text-base">From: {shortenAddress(addressFrom)}</p>
                    </a>
                    <a href={`https://ropsten.etherscan.io/address/${addressTo}`} target="_blank" rel="noopener noreferrer">
                        <p className="text-sky-700 text-base">To: {shortenAddress(addressTo)}</p>
                    </a>
                    <p className="text-sky-700 text-base">Amount: {amount} ETH</p>
                    {message && (
                        <>
                            <br />
                            <p className="text-sky-700 text-base">Message: {message}</p>
                        </>
                    )}
                </div>
                    <img
                        src={gifUrl || url}
                        alt="nature"
                        className="w-full h-64 2xl:h-96 rounded-md shadow-lg object-cover"
                    />
                    <div className="bg-sky-50 p-3 px-5 w-max rounded-3xl -mt-5 shadow-2xl">
                        <p className="text-sky-700 font-bold">{timestamp}</p>
                    </div>
            </div>
        </div>
    )   
}

const Transactions = () => {
    const { currentAccount, transactions } = useContext(TransactionContext);
    
    return (
        <div className="flex w-full justify-center items-center 2xl:px-20 gradient-bg-transactions">
            <div className="flex flex-col md:p-12 py-12 px-4">
                {/* We show different titles depending on whether the user has an account connected. */}
                {currentAccount ? (
                    <h3 className="text-white text-3xl text-center my-2">Latest transactions</h3>
                ) : (
                    <h3 className="text-white text-3xl text-center my-2">Connect your account to see the latest transactions</h3>
                )}

                <div className="flex flex-wrap justify-center items-center mt-10">
                    {/* We map over the transactions and reverse their order to show the latest first. */}
                    {transactions.reverse().map((transaction, i) => (
                        <TransactionCard key={i} {...transaction} />
                    ))}
                </div>
            </div>
        </div>
    )
};

export default Transactions;