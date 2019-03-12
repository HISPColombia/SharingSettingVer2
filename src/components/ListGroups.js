import React from 'react';

//Material UI

import appTheme from '../theme';
import SpecialButton from './SpecialButton';
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import User from 'material-ui/svg-icons/social/person';
import Group from 'material-ui/svg-icons/social/group';

//Component
import SearchTextBox from './SearchTextBox';
//
const styles = {
  paper: {
    height: 260,
    overflow: 'auto',
    width: '90%',
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  textBox:{
    width: '90%',
    background:appTheme.rawTheme.palette.canvasColor,
    margin: 20,
  },
  columnForEditButton: {
    width: '25%'
  },
  columnIcon: {
    width: 10
  },
  iconColor: appTheme.settingOptions.icon


}



class ListGroups extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      sharingOption: {
        userAccesses: [],
        userGroupAccesses: []
      }
    };
  }
  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    try {
      let res = await api.get(urlAPI);
      return res;      
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
  async searchUserGroups(valuetoSearch){
     return this.getResourceSelected("29/sharing/search?key="+valuetoSearch).then(res => {
       let user=res.users.map(function(user){
          return({
            id:user.id,
            displayName:user.displayName,
            data:{type:'user'}
          })
       })
       let groups=res.userGroups.map(function(group){
        return({
          id:group.id,
          displayName:group.displayName,
          data:{type:'group'}
        })
     })
      let response=user.concat(groups);
       return response;
     })
  }
  returnGroupSelected(){
    this.props.GroupSelected(this.state.sharingOption);
  }
  SelectUserOrGroup(valueSelected){
    if(valueSelected.data.type=='user')
      this.state.sharingOption.userAccesses.push(
        {
          access: "--------",
          displayName: valueSelected.displayName,
          id: valueSelected.id,
          name: valueSelected.displayName
        }
      )
    else
      this.state.sharingOption.userGroupAccesses.push(
        {
          access: "--------",
          displayName: valueSelected.displayName,
          id: valueSelected.id,
          name: valueSelected.displayName
        }
      )
      this.setState({sharingOption:this.state.sharingOption})
  }
  render() {
    const d2 = this.props.d2;
    var keyCount=0;
    return (
      <div style={{position: 'relative'}} >
        <div style={styles.paper}>
          <Table>

            <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
              <TableRow>

                <TableHeaderColumn columnNumber={2}>{d2.i18n.getTranslation("TABLE_USER_NAME")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}>{d2.i18n.getTranslation("TABLE_METADATA_ACCESS")}</TableHeaderColumn>
                <TableHeaderColumn style={styles.columnForEditButton}> {d2.i18n.getTranslation("TABLE_DATA_ACCESS")}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                this.state.sharingOption.userAccesses.map(function (option) {
                  keyCount++;
                  return (
                    <TableRow key={option.id+"_"+keyCount}>
                      <TableRowColumn style={styles.columnIcon}><User color={styles.iconColor} /></TableRowColumn>
                      <TableRowColumn><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}> <SpecialButton color={styles.iconColor} /> </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                        <SpecialButton color={styles.iconColor} />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
 
               {
                this.state.sharingOption.userGroupAccesses.map(function (option) {
                  return (
                    <TableRow key={option.id+"_"+keyCount}>
                      <TableRowColumn style={styles.columnIcon}><Group color={styles.iconColor} /></TableRowColumn>
                      <TableRowColumn><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}> <SpecialButton color={styles.iconColor} /> </TableRowColumn>
                      <TableRowColumn style={styles.columnForEditButton}>
                        <SpecialButton color={styles.iconColor} />
                      </TableRowColumn>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
          </div>
          <div style={styles.textBox}>
        <SearchTextBox 
        source={this.searchUserGroups.bind(this)} 
        title={d2.i18n.getTranslation("TITLE_SEARCH_GROUP")} 
        callBackSelected={this.SelectUserOrGroup.bind(this)} 
        color={styles.iconColor}
        showValueSelected={false}  
        disabled={false}        
        />
        </div>
      </div>
    );
  }
}

ListGroups.propTypes = {
  d2: React.PropTypes.object.isRequired,
  GroupSelected:React.PropTypes.func
};


export default ListGroups