import liff from '@line/liff';
import  { useEffect, useState } from 'react';

const App = () => {
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [qrCode, setQrCode] = useState('');
  const [message, setMessage] = useState('Hello from LIFF!');

  useEffect(() => {
    liff.init({ liffId: import.meta.env.VITE_LIFF_ID })
      .then(() => {
        if (liff.isLoggedIn()) {
          setIsLoggedIn(true);
          loadUserProfile();
          getEnvironmentInfo();
        } else {
          liff.login();
        }
      })
      .catch(err => console.error("LIFF initialization failed", err));
  }, []);

  const loadUserProfile = async () => {
    try {
      const profile = await liff.getProfile();
      setProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
    }
  };

  const getEnvironmentInfo = () => {
    const env = {
      os: liff.getOS(),
      language: liff.getLanguage(),
      isInClient: liff.isInClient(),
      version: liff.getVersion()
    };
    setEnvironment(env);
  };

  const sendMessage = async () => {
    if (liff.isInClient()) {
      try {
        await liff.sendMessages([
          { type: 'text', text: message }
        ]);
        alert("Message sent!");
      } catch (error) {
        console.error("Error sending message:", error);
      }
    } else {
      alert("This feature is only available in the LINE app.");
    }
  };

  const generateQrCode = () => {
    const liffUrl = `https://liff.line.me/${import.meta.env.VITE_LIFF_ID}`;
    setQrCode(liffUrl);
  };

  const startPayment = () => {
    alert("This is a simulated payment process.");
  };

  return (
    <div className="App">
      <h1>LINE LIFF Demo with React & Vite</h1>

      {isLoggedIn && profile && (
        <div>
          <h2>Welcome, {profile.displayName}</h2>
          <img src={profile.pictureUrl} alt="User profile" width="100" />
        </div>
      )}

      {environment && (
        <div>
          <h3>Environment Info:</h3>
          <p>OS: {environment.os}</p>
          <p>Language: {environment.language}</p>
          <p>In LINE Client: {environment.isInClient ? "Yes" : "No"}</p>
          <p>LIFF Version: {environment.version}</p>
        </div>
      )}

      <button onClick={sendMessage}>Send Message to LINE</button>
      
      <div>
        <button onClick={generateQrCode}>Generate QR Code</button>
        {qrCode && (
          <div>
            <p>QR Code URL: {qrCode}</p>
            <img src={`https://api.qrserver.com/v1/create-qr-code/?data=${qrCode}&size=150x150`} alt="QR Code" />
          </div>
        )}
      </div>

      <button onClick={startPayment}>Start Payment (Simulated)</button>
    </div>
  );
};

export default App;
