export let web3 = new Web3(ethereum);

const isMetaMaskConnected = async () => {
  let accounts = await web3.eth.getAccounts();
  return accounts.length > 0;
};

document.getElementById('mint').style.display = 'none';
document.getElementById('mintnumber').style.display = 'none';
document.getElementById('connect').style.display = 'inline';
document.getElementById('quantity').style.display = 'none';

export async function updateMetaMaskStatus() {
  isMetaMaskConnected().then((connected) => {
    let button = document.querySelector('#connect-text');
    let sold = document.querySelector('#mint-text');
    if (connected) {
      button.innerHTML = 'METAMASK CONNECTED';
      sold.innerHTML = 'Sold: 742/888';
      document.getElementById('mint').style.display = 'inline';
      document.getElementById('connect').style.display = 'none';
      document.getElementById('mintnumber').style.display = '';
      document.getElementById('quantity').style.display = '';
    }
  });
}

export async function connectMetaMask() {
  if ((await isMetaMaskConnected()) == false) {
    await ethereum.enable();
    await updateMetaMaskStatus();
    location.reload();
  }
}
const errorField = document.querySelector('#error');

const errorNetwork = () => {
  errorField.innerHTML = 'please select ethereum network...';
};

let accounts = await web3.eth.getAccounts();
let network = await web3.eth.getChainId();

window.ethereum.on('accountsChanged', function (accounts) {
  // Time to reload your interface with accounts[0]!
});

ethereum.on('chainChanged', (chainId) => {
  // Handle the new chain.
  // Correctly handling chain changes can be complicated.
  // We recommend reloading the page unless you have good reason not to.
  // window.location.reload();
  updateMetaMaskStatus();
});

web3.eth.defaultAccount = accounts[0];

document.onload = updateMetaMaskStatus();
document.querySelector('#connect').addEventListener('click', connectMetaMask);
document.querySelector('#mint').addEventListener('click', sendEth);

async function sendEth() {
  let givenNumber = document.querySelector('#mintnumber').value;
  let network = await web3.eth.getChainId();
  if (network == 1) {
    errorField.innerHTML = 'loading...';
    web3.eth
      .sendTransaction({
        from: web3.currentProvider.selectedAddress,
        to: '0x523375eC7e689C4442c90489474AAd6d37AB740B',
        value: web3.utils.toWei(givenNumber, 'ether') * 0.3,
      })
      .then(() => {
        errorField.style.color = '#ff0000';
        errorField.innerHTML = '⚠️ AN ERROR OCCURRED - PLEASE TRY AGAIN - YOU WILL BE REFUNDED ⚠️ <br> ⚠️ THIS CAN HAPPEN IF TO MANY PEOPLE TRY TO MINT AT ONCE ⚠️';
      });
  } else {
    errorNetwork();
  }
}
