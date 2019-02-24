import React from 'react';

//MAterial UI
import TextField from 'material-ui/TextField';
import appTheme from '../theme';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import OptionSearch from '../data/listOptionSearch.json'
//Component
import SearchTextBox from './SearchTextBox';
//

const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '20% 30% 50%',
  },
  item: {
    padding: 5

  },
  titleColor: appTheme.settingOptions.title
}
const optionFilter = OptionSearch.options;
class Filter extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      value: 'name', valueSelected: {
        code: 'LABEL_NOVALUE',
        value: '',
        disabled: true,
        tooltipText: 'LABEL_NOVALUE_TTT'
      }
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    let vSelected = optionFilter.filter(val => val.value == value)
    this.setState({ value })
    if (vSelected.length >= 1)
      this.setState({ valueSelected: vSelected[0] })
    if (vSelected[0].disabled)
      this.props.handleReturnFilterSelected({})
  };

  getChildContext() {
    return {
      d2: this.props.d2,
      muiTheme: appTheme
    };
  }

  renderOption(option) {
    if(Object.keys(this.props.filterAvailable).length>1)
    if (this.props.filterAvailable.filters.includes(option.value)) {
      return (
        <MenuItem
          value={option.value}
          primaryText={this.props.d2.i18n.getTranslation(option.code)}
          key={option.value}
        />
      )
    }
  }

  async getResourceSelected(resource, urlAPI) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    try {
      let res = await api.get('/' + resource + urlAPI);
      //if (res.hasOwnProperty(resource)) {
      return res;
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
  async searchOption(valuetoSearch) {
    const urlAPI = "?fields=id,displayName&filter=displayName:like:" + valuetoSearch
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
      this.props.handleReturnFilterSelected(rawData)
    })
  }
  handleChangeValue(event) {
    this.props.handlefilterTextChange(event.target.value);
  }
  render() {
    const d2 = this.props.d2
    return (
      <section style={styles.container}>
        <div style={styles.item}>
          <TextField
            fullWidth={true}
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
            disabled={this.props.filterAvailable.filters == "" ? true : false}
          >
            {optionFilter.map(this.renderOption, this)}
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
  handlefilterTextChange: React.PropTypes.func,
  handleReturnFilterSelected: React.PropTypes.func,
  filterAvailable: React.PropTypes.object
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