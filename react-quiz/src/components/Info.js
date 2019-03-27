import React, { Component } from 'react';
import InfoPoint from '../components/InfoPoint';
import Option from '../components/Option';
import Search from '../components/Search';

class Info extends Component {

  constructor() {
    super();
    
    this.state = {
      page: 'Info',
      info: [],
      personalInfo: []
     };

     this.switch = this.switch.bind(this);
     this.search = this.search.bind(this);
     this.renderInfoPoints = this.renderInfoPoints.bind(this);
     
  }

 componentWillMount() {
  this.setState({
    info: this.props.info,
    personalInfo: this.props.personalInfo
   });
 }

 search(value) {
  value = value.toLowerCase();
  var array = [];
  var title = "";
  this.setState({
    info: [],
    personalInfo: []
   });
  
  if(this.state.page === "Info") {
    for (var i = 0; i < this.props.infoSaved.length; i++){
      title = this.props.infoSaved[i].title;
      title = title.toLowerCase();
      if(title.includes(value)) {
        array.push(this.props.infoSaved[i]);
        this.setState({
          info: array,
          personalInfo: this.props.personalSave
         });
      }
    }
  }
  else if(this.state.page === "Personalised") {
    for (var j = 0; j < this.props.personalSave.length; j++){
      title = this.props.personalSave[j].title;
      title = title.toLowerCase();
      if(title.includes(value)) {
        array.push(this.props.personalSave[j]);
        this.setState({
          info: this.props.infoSaved,
          personalInfo: array
         });
      }
    }
  }
}

  renderInfoPoints(key) {
    return (
      <InfoPoint
        key={key}
        title={key.title}
        content={key.content}
        page={this.state.page}
        deleteFunc={this.props.deleteFunc}
      />
    );
  }

  switch() {
    if(this.state.page === "Info") {
      this.setState({ page: "Personalised" });
    }
    else {
      this.setState({ page: "Info" });
    }

  }

  render() {
    if(this.state.page === "Info") {
      return (
        <div>
          <Option symbol="fa fa-home fa-3x" side="option top" change={this.props.button}/>
          <Option symbol="fa fa-clone fa-3x" side="option switch" change={this.switch}/>
          <Search onChange={this.search} class="infoSearch"/>
          <ul className="info">
            {this.state.info.map(this.renderInfoPoints)}
          </ul>
        </div>
      );
    }
    else {
      return (
        <div>
          <Option symbol="fa fa-home fa-3x" side="option top" change={this.props.button}/>
          <Option symbol="fa fa-clone fa-3x" side="option switch" change={this.switch}/>
          <Search onChange={this.search} class="infoSearch"/>
          <h4> This Info has been personalised for you </h4>
          <ul className="info">
            {this.state.personalInfo.map(this.renderInfoPoints)}
          </ul>
        </div>
      );
    }
    
  }
}


export default Info;
