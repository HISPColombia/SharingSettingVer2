
import React from 'react';
import IconButton from 'material-ui/IconButton';
import FlatButton from 'material-ui/FlatButton';
import None from 'material-ui/svg-icons/av/not-interested'; 
import ActionDone from 'material-ui/svg-icons/action/done';
import ActionDoneAll from 'material-ui/svg-icons/action/done-all'; 

class SpecialButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {value: 0};
      }
      handleClickButton(){
          switch(this.state.value){
            case 0:
                this.setState({value:1})
                break;
            case 1:
                this.setState({value:2})
                break;
            case 2:
                this.setState({value:0})
                break;
          }
      }
   
      render() {
        return (
            <div>
                <FlatButton label="Label before" onClick={()=>this.handleClickButton()} icon={this.state.value==0? <None/>: this.state.value==1?<ActionDone/>: <ActionDoneAll/>} />
            </div>
        )
    }
}
SpecialButton.propTypes = {
    value: React.PropTypes.number,
  };
  
  
  export default SpecialButton