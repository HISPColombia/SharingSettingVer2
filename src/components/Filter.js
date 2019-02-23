import React from 'react';

//MAterial UI
import TextField from 'material-ui/TextField';
import appTheme from '../theme';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

//Component
import SearchTextBox from './SearchTextBox';
//

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '20% 20% 40% 20%',
  },
  item:{
    padding: 5,
    //border: '1px solid red'

  },
  titleColor: appTheme.settingOptions.title
}

const optionFilter=[
  {
    code:'LABEL_SEARCHDATASET',
    value:'dataset',
    default:false
  },
  {
    code:'LABEL_SEARCHPROGRAM',
    value:'program',
    default:false
  },  

];

class Filter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {value: 'name'};
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(event, index, value){
    this.setState({value})
  };

  getChildContext() {
    return {
      d2: this.props.d2,
      muiTheme: appTheme
    };
  }

  renderOption(option){
    return(
      <MenuItem
              value={option.value}
              primaryText={option.code==null?"":this.props.d2.i18n.getTranslation(option.code)}
              key={option.value}
            />
  )}
  searchOption(){
    return({
      id:"1",
      displayName:"Prueba",
      data:{}
    })
  }

  selectOption(){
    console.log("seleccionado")
  }

  render() {
    const d2= this.props.d2
    return (
      <section  style={styles.container}>
         <div style={styles.item}>
         <TextField
          fullWidth= {true}
          hintText={this.props.d2.i18n.getTranslation('LABEL_SEARCHNAME')}
          floatingLabelText={this.props.d2.i18n.getTranslation('LABEL_SEARCHNAME')}
        />
        </div>
        <div style={styles.item}>
          <SelectField  
           floatingLabelText={this.props.d2.i18n.getTranslation('LABEL_SEARCHPROGRAMORDATASET')}
            value={this.state.value}
            onChange={this.handleChange}
            floatingLabelFixed={true}
          >
          {optionFilter.map(this.renderOption,this)}
          </SelectField>
         </div>
         <div style={styles.item}>
         <SearchTextBox 
            source={this.searchOption.bind(this)} 
            title={d2.i18n.getTranslation("TITLE_SEARCH_GROUP")} 
            callBackSelected={this.selectOption.bind(this)} 
            color={styles.titleColor} 
         />

         </div>
         <div style={styles.item}>
         </div>
         
      </section>
    );
  }
}

Filter.propTypes = {
  d2: React.PropTypes.object.isRequired,
};

Filter.contextTypes = {
  title: React.PropTypes.string,
  muiTheme: React.PropTypes.object
};

Filter.childContextTypes = {
  d2: React.PropTypes.object,
  muiTheme: React.PropTypes.object
};
export default Filter