//new
import React, { useRef, useEffect, useState, useReducer } from "react";

//import { AddBotBtn, ConsumedUnits } from "./index.js";
import { useAccount } from '@/components/AccountProvider';
import { useWallet } from "@demox-labs/aleo-wallet-adapter-react";
import CreateDAO from "@/components/CreateDAO.jsx"
import DAOList from "@/components/DAOList.jsx"
import Image from "next/image"

const forceUpdateReducer = (x) => x + 1;


function Profile({ }) {
  const [tokenurl, setTokenurl] = useState('');
  const [, forceUpdate] = useReducer(forceUpdateReducer, 0);

  const forceUpdatePush = () => {
    forceUpdate(); // This forces a re-render
  };

  const { connected, loading, setConnected, logOut } = useAccount();
  const { publicKey } = useWallet();

  const daos = [];
  useEffect(() => {
    var checkExist = setInterval(function () {
      if (document.querySelectorAll('.copyInput button').length > 0) {
        var copyContainer = $(".copyInput button");
        copyContainer.click(function () {
          var $temp = $("<input>");
          $("body").append($temp);
          console.log($(this).siblings().text());
          $temp.val($(this).siblings().text()).select();
          document.execCommand("copy");
          $temp.remove();
          document.body.className = 'copying';
          var stopCopying = setTimeout(function () {
            document.body.className = '';
          }, 700);

        });
        clearInterval(checkExist);
      }
    }, 300);
  }, []);
  if (loading) {
    return (
      <section className="hero-area-3">
        <h1><Image src={require("../img/loader-loading.gif").default} alt="" className="loading_profile_gif" height={100} width={100} /></h1>
      </section>
    )
  }
  if (connected) {
    const prices = [25, 60, 100, 150];
    return (
      <div>
        <div className="account_info">
          <div className="discord-link">
            <h2>Logged in as </h2>
            <div className="link-copy copyInput">
              <div>{publicKey}</div>
              <button><i className="fas fa-copy"></i></button>
            </div>
            <a href="#" onClick={logOut}><div className="logout_div"><Image src={require("../img/logout.png").default} alt="" className="logout_img" height={35} with={"auto"} /></div></a>
          </div>
        </div>
        <section className="bot-area less_padding_top_bot">
          {(daos.length === 0) && (<div className="container">
            {/*
              <AddBotBtn />
            */}
            <DAOList />
            <CreateDAO />
          </div>)}

          {(daos.length !== 0) && (<div className="container">
            <AddBotBtn />
            <ConsumedUnits />
            {
              (window.buy_status == 'done')
              &&
              <div className="sub-end">
                <span className="premium_a"><Image className="premium_img_prof premium_img" src={require("../img/premium.png").default} alt="" />You have premium access<br /><br /></span>
                End of subsciption : <span className="strong_underline">{new Date(window.end_membership_ms).toLocaleString('sv').split(' ')[0]}</span></div>
            }

            {(window.buy_status == 'done') ? <h1 className="sec-title mt-5">Extend your membership:</h1> : <h1 className="sec-title mt-5">Go premium:</h1>}

            <div className="row">
              <div className="col-md-12 mb-40 mt-4">
                <nav className="text-center">
                  <div className="nav nav-tabs bot-tab-nav" id="nav-tab" role="tablist">
                    <button className="nav-link active" id="nav-One-tab" data-bs-toggle="tab"
                      data-bs-target="#nav-One" type="button" role="tab" aria-controls="nav-One"
                      aria-selected="true">1 Month</button>
                    <button className="nav-link" id="nav-Two-tab" data-bs-toggle="tab" data-bs-target="#nav-Two"
                      type="button" role="tab" aria-controls="nav-Two" aria-selected="false">3 Months</button>
                    <button className="nav-link" id="nav-Three-tab" data-bs-toggle="tab"
                      data-bs-target="#nav-Three" type="button" role="tab" aria-controls="nav-Three"
                      aria-selected="false">6 Months</button>
                    <button className="nav-link" id="nav-Four-tab" data-bs-toggle="tab"
                      data-bs-target="#nav-Four" type="button" role="tab" aria-controls="nav-Four"
                      aria-selected="false">1 Year</button>
                  </div>
                </nav>

              </div>
              <div className="col-xxl-12 mx-auto">
                <div className="tab-content" id="nav-tabContent">
                  <div className="tab-pane fade show active" id="nav-One" role="tabpanel"
                    aria-labelledby="nav-One-tab">
                    <h1><span className="underline">Total : <span className="total_price">{prices[0]}</span> ALEO</span></h1>
                  </div>
                  <div className="tab-pane fade" id="nav-Two" role="tabpanel" aria-labelledby="nav-Two-tab">
                    <h1><span className="underline">Total : <span className="total_price">{prices[1]}</span> ALEO</span></h1>
                  </div>
                  <div className="tab-pane fade" id="nav-Three" role="tabpanel" aria-labelledby="nav-Three-tab">
                    <h1><span className="underline">Total : <span className="total_price">{prices[2]}</span> ALEO</span></h1>
                  </div>
                  <div className="tab-pane fade" id="nav-Four" role="tabpanel" aria-labelledby="nav-Four-tab">
                    <h1><span className="underline">Total : <span className="total_price">{prices[3]}</span> ALEO</span></h1>
                  </div>
                </div>
                <div className="text-center">
                  <a href="" onClick={purchaseBot} className="theme-btn green-btn">Continue</a>
                </div>
                <div className="text-center coupon_div">
                  <span className="coupon_span">OR</span>
                  <input placeholder="PROMO" type="text" id="coupon_input" />
                  <a href="#" onClick={useCoupon} className="theme-btn" id="cpn_btn">Use code</a></div>
              </div>
            </div>
          </div>
          )}
        </section>
      </div>
    );


  }
  else {
    return (
      <section className="hero-area-3">
        <h1>Not connected</h1>
        <h2>You must be <strong className="strong_underline">connected</strong> to see this page.</h2>
      </section>
    );
  }
}

export default Profile;
