import {useState, useEffect} from "react";
import {ethers} from "ethers";
import abi from "./contracts/abi.json";

export default function HomePage() {
  const [ethWallet, setEthWallet] = useState(undefined);
  const [account, setAccount] = useState(undefined);
  const [contract, setContract] = useState(undefined);
  const [score, setScore] = useState(undefined);
  const [student, setStudent] = useState(undefined);
  const [newScore, setNewScore] = useState(undefined);
  const [newStudent, setNewStudent] = useState(undefined);

  const contractAddress = "0x1680A7e424c27B4a619D9bCf10Ca5B2623Aab2ec";
  const ABI = abi;

  const getWallet = async() => {
    if (window.ethereum) {
      setEthWallet(window.ethereum);
    }

    if (ethWallet) {
      const account = await ethWallet.request({method: "eth_accounts"});
      handleAccount(account);
    }
  }

  const handleAccount = (account) => {
    if (account) {
      console.log ("Account connected: ", account);
      setAccount(account);
    }
    else {
      console.log("No account found");
    }
  }

  const connectAccount = async() => {
    if (!ethWallet) {
      alert('MetaMask wallet is required to connect');
      return;
    }
  
    const accounts = await ethWallet.request({ method: 'eth_requestAccounts' });
    handleAccount(accounts);
    
    // once wallet is set we can get a reference to our deployed contract
    getContract();
  };

  const getContract = () => {
    const provider = new ethers.providers.Web3Provider(ethWallet);
    const signer = provider.getSigner();
    const theContract = new ethers.Contract(contractAddress,ABI, signer);
 
    setContract(theContract);
  }

  const getScore = async() => {
    if (contract) {
      setScore((await contract.score()).toNumber());
    }
  }

  const getStudent = async() => {
    if (contract) {
      setStudent((await contract.student()));
    }
  }

  const setTheScore = async(newScore) => {
    if (contract) {
      let tx = await contract.setScore(newScore);
      await tx.wait()
      getScore();
    }
  }

  const setTheStudent = async(newStudent) => {
    try {
      if (contract) {
        let tx = await contract.setStudent(newStudent);
        await tx.wait()
        getStudent();
      }
    } catch (error) {
      console.log(error);
      alert(error);
    }
  }

  const initUser = () => {
    // Check to see if user has Metamask
    if (!ethWallet) {
      return <p>Please install Metamask in order to use this Contract.</p>
    }
    // Check to see if user is connected. If not, connect to their account
    if (!account) {
      return <button onClick={connectAccount}>Please connect your Metamask wallet</button>
    }

    if (score == undefined || student == undefined) {
      getScore();
      getStudent();
    }

    return (
      <div>
        <p>Your Account: {account}</p>
        <hr></hr>
        <h4>Student Recorded: {student}</h4>
        <p>Your Score: {score}</p>
        <hr/>
        <hr/>
        {scoreForm()}
        <button onClick={() => (setTheScore(newScore))}>set a new score</button>
        <hr/>
        <hr/>
        {studentForm()}
        <button onClick={() => (setTheStudent(newStudent))}>register a new student</button>

      </div>
    )
  }

  useEffect(() => {getWallet();}, []);

  
  const scoreForm = () => {
    return (
      <form>
        <label> enter new score here </label>
        <input type="number" value={newScore} onChange={(event) => {setNewScore(event.target.value)}}></input>
      </form>
    )
   }

   const studentForm = () => {
    return (
      <form>
        <label> enter new Student Address here </label>
        <input type="string" value={newStudent} onChange={(event) => {setNewStudent(event.target.value)}}></input>
      </form>
    )
   }

  return (
    <main className="container">
      <header><h1>Welcome to the student records Contract!</h1></header>
      {initUser()}
      <style jsx>{`
        .container {
          text-align: center
        }
      `}
      </style>
    </main>
  )

      }
