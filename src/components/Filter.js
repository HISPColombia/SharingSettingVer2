import React from 'react';

//MAterial UI
import TextField from '@mui/material/TextField';
import appTheme from '../theme';

import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Box from '@mui/material/Box';
import MenuItem from '@mui/material/MenuItem';
import SelectField from '@mui/material/Select';
import InitiallistOptionSearch from '../data/listOptionSearch.json'
//Component
import SearchTextBox from './SearchTextBox';
//
//dhis2
import i18n from '../locales/index.js' 
import {get,post} from '../API/Dhis2.js';

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '20% 30% 50%',
  },
  item: {
    padding: 5

  },
  titleColor: appTheme.palette.primary.settingOptions.title
}
class Filter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      value: 'name', valueSelected: {
        code: '<No value>',
        value: '',
        disabled: true,
        tooltipText: 'Select one filter option'
      },
      optionFilter:[]
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    let vSelected = this.state.optionFilter.filter(val => val.value == event.target.value)
    this.setState({ value:event.target.value })
    if (vSelected.length >= 1)
      this.setState({ valueSelected: vSelected[0] })
    if (vSelected[0].disabled)
      this.props.handleReturnFilterSelected({})
  };

  getChildContext() {
    return {
      muiTheme: appTheme
    };
  }

  renderOption(option) {
    if(Object.keys(this.props.filterAvailable).length>1)
    if (this.props.filterAvailable.filters.includes(option.value)) {
      return (
        <MenuItem 
          value={option.value}
          key={option.value}
        >
        {i18n.t(option.code)}
        </MenuItem>
      )
    }
  }

  componentDidMount() {
          // if listOptionSearch.json is empty, get it from dhis2
          get('/dataStore/sharingsettingapp/listOptionSearch').then(r => {
          if(r.httpStatusCode=== 404){
            console.log("ya no ingresa aquí")
            this.setState({ listOptionSearch: InitiallistOptionSearch,optionFilter: InitiallistOptionSearch.options });
            post('/dataStore/sharingsettingapp/listOptionSearch', InitiallistOptionSearch).then(r => {console.log(r)})
          }
          else{
            this.setState({ listOptionSearch: r,optionFilter: r.options });
          }
        }).catch(error => {
          console.log(error);
        })
  }

  async getResourceSelected(resource, urlAPI) {

    let result = {};
    try {
      let res = await get('/' + resource + urlAPI);
      //if (res.hasOwnProperty(resource)) {
      return res;
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
  async searchOption(valuetoSearch) {
    const urlAPI = "?fields=id,name,displayName~rename(label)&filter=displayName:like:" + valuetoSearch
    return this.getResourceSelected(this.state.valueSelected.value, urlAPI).then(res => {
      return res[this.state.valueSelected.value];
    })
  }
  async filterOption(filter, resource, id) {
    const urlAPI = "/" + id + filter;
    return this.getResourceSelected(resource, urlAPI).then(res => {
      return res;
    })
  }


  selectOption(valueSelected) {
    this.filterOption(this.state.valueSelected.filter, this.state.valueSelected.value, valueSelected.id).then(rawData => {
      this.props.handleReturnFilterSelected(rawData,this.state.valueSelected)
    })
  }
  handleChangeValue(event) {
    this.props.handlefilterTextChange(event.target.value);
  }
  render() {
    return (
      <section style={styles.container}>
        <div style={styles.item}>
          <TextField
            fullWidth={true}
            label={i18n.t(' Search by name')}
            variant="standard"
            onChange={this.handleChangeValue.bind(this)}
          />
        </div>
        <div style={styles.item}>
        <Box sx={{ minWidth: 120 }}>
          <FormControl variant="standard" fullWidth>
            <InputLabel id="selectfilter">
                {i18n.t('Filter objects related with:')}
            </InputLabel>
            <SelectField
              labelId="selectfilter"
              defaultValue={this.props.filterAvailable.filters === ""||this.props.filterAvailable.filters===undefined?i18n.t("<No value>"):i18n.t(this.props.filterAvailable.filters.split(',')[0])}
              value={this.state.value}
              onChange={this.handleChange}              
              disabled={this.props.filterAvailable.filters == "" ? true : false}
              inputProps={{
                name: i18n.t('Filter objects related with:'),
                id: 'uncontrolled-native',
              }}
            >
              {this.state.optionFilter.map(this.renderOption, this)}
            </SelectField>
              
          </FormControl>
        </Box>
        </div>
        <div style={styles.item}>
          <SearchTextBox
            source={this.searchOption.bind(this)}
            title={i18n.t(this.state.valueSelected.tooltipText)}
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

export default Filter