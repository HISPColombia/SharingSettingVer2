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
    gridTemplateColumns: '20% 30% 50%',
  },
  item:{
    padding: 5

  },
  titleColor: appTheme.settingOptions.title
}

const optionFilter=[
  {
    code:'LABEL_NOVALUE',
    value:'',
    disabled:true,
    tooltipText:'LABEL_NOVALUE_TTT'
  },
  {
    code:'LABEL_SEARCHDATASET',
    value:'dataSets',
    disabled:false,
    tooltipText:'LABEL_SEARCHDATASET_TTT'
  },
  {
    code:'LABEL_SEARCHPROGRAM',
    value:'programs',
    disabled:false,
    tooltipText:'LABEL_SEARCHPROGRAM_TTT'
  }, 
  {
    code:'LABEL_SEARCHUSERGROUP',
    value:'userGroups',
    disabled:false,
    tooltipText:'LABEL_SEARCHUSERGROUP_TTT'
  },
  {
    code:'LABEL_SEARCHUSER',
    value:'users',
    disabled:false,
    tooltipText:'LABEL_SEARCHUSER_TTT'
  } 

];

class Filter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {value:'name',valueSelected: {
      code:'LABEL_NOVALUE',
      value:'',
      disabled:true,
      tooltipText:'LABEL_NOVALUE_TTT'
    }};
    this.handleChange=this.handleChange.bind(this);
  }

  handleChange(event, index, value){
    let vSelected= optionFilter.filter(val=>val.value==value)
    this.setState({value})
    if(vSelected.length>=1)
      this.setState({valueSelected:vSelected[0]})
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
              primaryText={this.props.d2.i18n.getTranslation(option.code)}
              key={option.value}
            />
  )}

  async getResourceSelected(urlAPI,texttoSearch) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    try {
      let res = await api.get('/' + urlAPI + "?fields=id,displayName&filter=displayName:like:"+texttoSearch);
      if (res.hasOwnProperty(urlAPI)) {
        return res;
      }
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
  async searchOption(valuetoSearch){
    return this.getResourceSelected(this.state.valueSelected.value,valuetoSearch).then(res => {
      return res[this.state.valueSelected.value];
    })
  }

  selectOption(){
    console.log("seleccionado")
  }

  handleChangeValue(event) {
    this.props.handlefilterTextChange(event.target.value);
}
  render() {
    const d2= this.props.d2
    return (
      <section  style={styles.container}>
         <div style={styles.item}>
         <TextField
          fullWidth= {true}
          floatingLabelText={this.props.d2.i18n.getTranslation('LABEL_SEARCHNAME')}
          onChange={this.handleChangeValue.bind(this)}
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
            title={d2.i18n.getTranslation(this.state.valueSelected.tooltipText)} 
            callBackSelected={this.selectOption.bind(this)} 
            color={styles.titleColor} 
            showValueSelected={true}
            disabled={this.state.valueSelected.disabled}    
         />

         </div>
        
      </section>
    );
  }
}

Filter.propTypes = {
  d2: React.PropTypes.object.isRequired,
  handlefilterTextChange: React.PropTypes.func
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