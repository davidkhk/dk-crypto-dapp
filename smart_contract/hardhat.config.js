require('@nomiclabs/hardhat-waffle');

module.exports = {
  solidity: '0.8.0',
  networks: {
    ropsten: {
      url: 'https://eth-ropsten.alchemyapi.io/v2/XyRAVwwurXRYz0VQSJo66TYwrHxH3Aj6',
      accounts: [ '8ce8f3419fa6f22832a1c81415fade07b5f6508b257850d4009bffdab0616d55' ]
    }
  }
}