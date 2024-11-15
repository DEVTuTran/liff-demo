import { useEffect, useState } from "react";
import liff from "@line/liff";
import "./App.css";

const App = () => {
  const [profile, setProfile] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [environment, setEnvironment] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const liffId = import.meta.env.VITE_LIFF_ID;

  useEffect(() => {
    liff
      .init({ liffId })
      .then(() => {
        setIsLoggedIn(liff.isLoggedIn());
        if (liff.isLoggedIn()) {
          loadUserProfile();
          getEnvironmentInfo();
        }
      })
      .catch((err) => {
        console.error("LIFF initialization failed", err);
        setError("Failed to initialize LIFF. Please try again.");
      });
  }, []);

  const handleLogin = () => {
    setLoading(true);
    liff.login(); // This triggers the login process only when the button is clicked
  };

  const handleLogout = () => {
    liff.logout();
    setIsLoggedIn(false);
    setProfile(null);
  };

  const loadUserProfile = async () => {
    try {
      const profile = await liff.getProfile();
      setProfile(profile);
    } catch (error) {
      console.error("Error fetching user profile:", error);
      setError("Error fetching user profile.");
    } finally {
      setLoading(false);
    }
  };

  const getEnvironmentInfo = () => {
    const env = {
      os: liff.getOS(),
      language: liff.getLanguage(),
      isInClient: liff.isInClient(),
      version: liff.getVersion(),
    };
    setEnvironment(env);
  };

  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      // Check if the scroll position is greater than 50px
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener("scroll", handleScroll);

    // Cleanup event listener on component unmount
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <div className="app-container">
      {/* <header className="header">
        <h1>LINE LIFF Demo</h1>
      </header>

      <main className="main-content">
        {error && <p className="error-message">{error}</p>}

        {isLoggedIn ? (
          <div className="profile-section">
            <img src={profile.pictureUrl} alt="User profile" className="profile-picture" />
            <h2>Welcome, {profile.displayName}</h2>
            <button onClick={handleLogout} className="logout-button">
              Logout
            </button>
          </div>
        ) : (
          <div className="login-section">
            <h2>Welcome to the LINE LIFF Demo</h2>
            <button onClick={handleLogin} disabled={loading} className="login-button">
              {loading ? "Logging in..." : "Login with LINE"}
            </button>
          </div>
        )}

        {environment && (
          <div className="environment-info">
            <h3>Environment Info:</h3>
            <ul>
              <li><strong>OS:</strong> {environment.os}</li>
              <li><strong>Language:</strong> {environment.language}</li>
              <li><strong>In LINE Client:</strong> {environment.isInClient ? "Yes" : "No"}</li>
              <li><strong>LIFF Version:</strong> {environment.version}</li>
            </ul>
          </div>
        )}
      </main>

      {/* Header */}
      <header
        className={`w-full sticky top-0 z-10 p-4 transition-colors duration-300 ${
          isScrolled
            ? "bg-white text-gray-800 shadow-lg"
            : "bg-[#F39700] text-white"
        } flex justify-between items-center`}
      >
        <div className="flex items-end space-x-2">
          <img
            src={
              isScrolled
                ? "https://unii-research.com/images/logo_secondary.svg"
                : "https://unii-research.com/images/index/logo.svg"
            }
            alt="Unii Logo"
            className="h-8"
          />
          <span className="text-[0.625rem] font-bold lg:text-xs">
            平均謝礼額5,500円のインタビュー副業
          </span>
        </div>
        <button className="px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700">
          LINEから無料登録
        </button>
      </header>

      {/* Main Content */}
      <main>
        <div className="h-100vw w-full relative mb-10 overflow-x-hidden bg-[linear-gradient(to_bottom,#F39700_93%,#FFFFFF_93%)] px-6 pb-5 pt-12 text-white lg:h-[600px] lg:bg-[linear-gradient(to_bottom,#F39700_86.25%,#FFFFFF_86.25%)] lg:p-5 lg:pb-0 lg:pt-8">
          <div className="mx-auto lg:w-[1000px]">
            <h1 className="text-3xl md:text-5xl font-bold leading-snug mb-6">
              あなたの声がお金に変わる
              <br />
              インタビュー副業サービス
            </h1>
            <img
              src="https://unii-research.com/images/index/logo.svg"
              alt="Unii Logo"
              className="mb-14 w-[250px] lg:mx-0 lg:mb-14 lg:max-w-[340px]"
            />
            <div className="mb-12 text-center lg:mb-0 lg:w-[540px]">
              <p className="mb-2 block font-bold">
                ＼累計インタビュー数
                <span className="px-1 text-3xl">43,000</span>
                件突破！／
              </p>
              <div className="mx-auto max-w-[360px] lg:max-w-[340px]">
                <button
                  onClick={handleLogin}
                  disabled={loading}
                  className="w-full mt-6 px-8 py-3 bg-green-600 text-white font-semibold rounded-full shadow-lg hover:bg-green-700"
                >
                  LINEから無料登録
                </button>
              </div>
            </div>
            <img
              src="https://unii-research.com/images/index/mv_bg_pc.svg"
              alt="Illustration"
              className="mx-auto w-full max-w-[500px] lg:absolute lg:bottom-[45px] lg:left-[50%]"
            />
          </div>
        </div>
        <div className="mb-20">
          <div className="bg-[url('https://unii-research.com/images/index/about_bg.svg')] bg-contain bg-bottom bg-no-repeat pb-20 lg:pb-10">
            <div className="mx-auto px-6 lg:w-[1000px]">
              <h1 className="mb-10 flex w-full items-end justify-center text-center text-4xl font-bold lg:mb-2">
                <img
                  alt="unii(ユニー)リサーチ"
                  loading="lazy"
                  width="392"
                  height="80"
                  decoding="async"
                  data-nimg="1"
                  className="w-60 lg:w-80"
                  src="https://unii-research.com/images/logo_secondary.svg"
                />
                <span className="px-1 text-2xl leading-none lg:text-3xl lg:leading-none">
                  とは？
                </span>
              </h1>

              <div className="flex flex-col justify-center space-y-10 lg:flex-row lg:items-end">
                {/* Left Section */}
                <div className="flex-1 text-center">
                  <p className="mb-8 text-2xl font-bold leading-normal lg:mb-12 lg:text-4xl lg:leading-normal">
                    ユーザーの声を
                    <br />
                    聴きたい企業
                  </p>
                  <img
                    alt="企業"
                    loading="lazy"
                    width="343"
                    height="184"
                    decoding="async"
                    data-nimg="1"
                    className="inline"
                    src="https://unii-research.com/images/index/about_company.svg"
                  />
                </div>
                <div className="flex-1 text-center">
                  <p className="mb-8 text-2xl font-bold leading-normal lg:mb-12 lg:text-4xl lg:leading-normal">
                    ユーザーの声を
                    <br />
                    聴きたい企業
                  </p>
                  <img
                    alt="企業"
                    loading="lazy"
                    width="343"
                    height="184"
                    decoding="async"
                    data-nimg="1"
                    className="inline"
                    src="https://unii-research.com/_next/image/?url=%2Fimages%2Findex%2Fabout_screen.png&w=640&q=75"
                  />
                </div>

                {/* Right Section */}
                <div className="flex-1 text-center">
                  <p className="mb-8 text-2xl font-bold leading-normal lg:mb-12 lg:text-4xl lg:leading-normal">
                    スキマ時間に
                    <br />
                    インタビューで
                    <br />
                    副業したい人
                  </p>
                  <img
                    alt="ユーザー"
                    loading="lazy"
                    width="200"
                    height="160"
                    decoding="async"
                    data-nimg="1"
                    className="inline"
                    src="https://unii-research.com/images/index/about_user.svg"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="bg-[#FFF8EF] px-6 pb-5 text-center lg:bg-[linear-gradient(to_bottom,#FFF8EF_62%,#FFEFD5_62%)] lg:pb-8">
            <h1 className="mb-8 text-2xl font-bold leading-normal text-primary lg:bg-[url('/images/index/about_arrow.svg')] lg:bg-bottom lg:bg-no-repeat lg:pb-20 lg:text-4xl lg:leading-normal">
              インタビューしたい企業と
              <br />
              副業したい人をマッチング
            </h1>

            {/* Image for small screens */}
            <img
              alt="unii(ユニー)リサーチ画面"
              loading="lazy"
              width="250"
              height="484"
              decoding="async"
              data-nimg="1"
              className="mx-auto"
              srcSet="https://unii-research.com/images/index/about_arrow.svg"
              src="https://unii-research.com/images/index/about_arrow.svg"
            />

            <div className="relative mx-auto text-center lg:w-[1000px]">
              <span className="absolute -left-56 -top-32 right-0 mx-auto flex h-[130px] w-[130px] items-center justify-center rounded-full bg-primary text-xl font-bold text-white lg:left-auto lg:top-auto lg:h-[218px] lg:w-[218px] lg:text-4xl">
                自宅で実施
                <br />
                匿名OK
              </span>
              <img
                alt="PCでもスマホでもインタビューできる"
                loading="lazy"
                width="1000"
                height="390"
                decoding="async"
                data-nimg="1"
                className="mb-8 hidden lg:inline"
                src="https://unii-research.com/images/index/about_interview.svg"
              />
            </div>

            <p className="mb-6 mt-8 text-2xl font-bold leading-normal text-primary lg:mt-0 lg:text-4xl lg:leading-normal">
              インタビューを受けると
              <br />
              企業から謝礼が送られます
            </p>
          </div>
        </div>
      </main>
      {/* Footer */}
      <footer className="w-full p-4 bg-white text-center text-gray-800">
        <p>
          &copy; {new Date().getFullYear()} Unii Research. All rights reserved.
        </p>
      </footer>
    </div>
  );
};

export default App;
