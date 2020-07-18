import React, { Component } from "react";
import logo from "./logo.svg";
import "./App.css";

class App extends Component {
	state = {tcpchecked : true, udpchecked: false, started: false};
  
	render() {
		return (
    <div className="div-header">
      <header className="header">Traffic Generator</header>
      <div className="separator"></div>
      <form className="pure-form">
        <div className="pure-g">
          <div className="pure-u-1-4" />
          <div className="pure-u-1-4">
            <label htmlFor="count">Number of flows to generate</label>
          </div>
          <div className="pure-u-1-4">
            <input id="count" className="pure-input-1" type="number" defaultValue="1"/>
          </div>
          <div className="pure-u-1-4" />
        </div>
        <div className="separator"></div>
        <div className="pure-g">
          <div className="pure-u-1-4" />
          <div className="pure-u-1-4">
            <label htmlFor="delay">Delay between flows (millis)</label>
          </div>
          <div className="pure-u-1-4">
            <input id="delay" className="pure-input-1" type="number" defaultValue="1000"/>
          </div>
          <div className="pure-u-1-4" />
        </div>
        <div className="separator"></div>
        <div className="pure-g">
          <div className="pure-u-1-4" />
          <div className="pure-u-1-4">
            <label htmlFor="url">URL (default: www.nfl.com)</label>
          </div>
          <div className="pure-u-1-4">
            <input id="url" className="pure-input-1" type="text" defaultValue="www.nfl.com"/>
          </div>
          <div className="pure-u-1-4" />
        </div>
        <div className="separator"></div>
        <div className="pure-g">
          <div className="pure-u-1-4" />
          <div className="pure-u-1-4">
            <label htmlFor="port">Port number</label>
          </div>
          <div className="pure-u-1-4">
            <input id="port" className="pure-input-1" type="number" defaultValue="80"/>
          </div>
          <div className="pure-u-1-4" />
        </div>

        <div className="separator"></div>
        <div className="pure-g">
          <div className="pure-u-1-4" />
          <div className="pure-u-1-4">
            <label htmlFor="tcpcb">Select protocol</label>
          </div>
          <div className="pure-u-1-4">
            <div className="pure-g">
              <label id="tcplabel" htmlFor="tcpcb" className="pure-checkbox pure-u-1-2">
                {" "}
                TCP{" "}
              </label>
              <input
				id="tcpcb"
				onChange = {this.test}
				onClick= {this.handleTCPSelect}
                className="pure-checkbox pure-u-1-2"
				type="checkbox"
				defaultChecked={this.state.tcpchecked}
              />
            </div>
            <div></div>
            <div className="pure-g">
              <label id="udplabel" htmlFor="udpcb" className="pure-checkbox pure-u-1-2">
                {" "}
                UDP{" "}
              </label>
              <input
				id="udpcb"
				onClick= {this.handleUDPSelect}
                className="pure-checkbox pure-u-1-2"
				type="checkbox"
				defaultChecked={this.state.udpchecked}
              />
            </div>
          </div>
          <div className="pure-u-1-4" />
        </div>
      </form>
	  <div className="separator"></div>
	  <div className="separator"></div>
      <div className="pure-g">
	  <div className="pure-u-1-5" />
        <div className="pure-u-1-5" />
        <button id="generate" onClick={this.handleGenerate} className="button-traff pure-button pure-u-1-5">Generate</button>
        <div className="pure-u-1-5" />
		<div className="pure-u-1-5" />

      </div>
    </div>
     );
}

test = () =>
{

}

handleTCPSelect = () =>
{
	let tcpcb = document.getElementById("tcpcb");
	let udpcb = document.getElementById("udpcb");
	if(tcpcb.checked == true)
	{
		this.setState({ tcpchecked:false});
	        console.log("I am here 3");
		udpcb.checked=false;
		udpcb.disabled=true;
	}
	else
	{
	        console.log("I am here 4");
		this.setState({ tcpchecked:true});
		udpcb.checked=true;
		udpcb.disabled=false;
		tcpcb.disabled=true;
	}
}

handleUDPSelect = () =>
{
	let tcpcb = document.getElementById("tcpcb");
	let udpcb = document.getElementById("udpcb");
	if(udpcb.checked)
	{
	        console.log("I am here 1");
		this.setState({ udpchecked:false});
		tcpcb.checked=false;
		tcpcb.disabled=true;
	}
	else
	{
	        console.log("I am here 2");
		this.setState({ udpchecked:true});
		tcpcb.checked=true;
		tcpcb.disabled=false;
		udpcb.disabled=true;
	}
}

handleGenerate = () =>
{

    var xhr = new XMLHttpRequest();
    let count = document.getElementById("count").value;
    let delay = document.getElementById("delay").value;
    let ip = document.getElementById("url").value;
    let port = document.getElementById("port").value;
    let proto_tcp = document.getElementById("tcpcb").checked;
    let upperctx = this;
    let gen_btn = document.getElementById("generate")
    var obj = new Object();
    if(count==="" || delay==="" || ip==="" || port==="")
    {
	alert("Error : Input field cannot be empty");
	return;
    }
    if(this.state.started == false)
    {
	obj.command = 1; // start
	obj.count = count;
	obj.delay = delay;
	obj.ip = ip;
	obj.port = port;
	obj.proto_tcp = proto_tcp;
    }
    else
    {
	obj.command = 2;
    }

    var url = "http://localhost:9000";
    xhr.open("POST", url, true);
    xhr.setRequestHeader("Content-Type", "application/json");
    xhr.onreadystatechange = function() {
	if (xhr.readyState === 4 && xhr.status === 200) {
	    if(upperctx.state.started == false)
	    {
		upperctx.setState({started: true});
		upperctx.timeout = setTimeout(upperctx.queryFunction, count * delay)
		gen_btn.innerHTML = "Stop";
		console.log("Stop set");
	    }
	    else
	    {
		upperctx.setState({started: false});
		clearTimeout(upperctx.timeout);
		gen_btn.innerHTML = "Generate";
		console.log("Gen set");

	    }
	    console.log(xhr.response);
	}
    };
    var data = JSON.stringify(obj);
    console.log(data);
    xhr.send(data);

}

queryFunction = () =>
{
    let gen_btn = document.getElementById("generate")
    this.setState({started: false});
    gen_btn.innerHTML = "Generate";
    console.log("Timer expired")
}
}
export default App;
