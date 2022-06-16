import React from 'react';

//Material UI


import Button from '@mui/material/Button';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableHead from '@mui/material/TableHead';
import TableRow from '@mui/material/TableRow';

import User from '@mui/icons-material/Person';
import Group from '@mui/icons-material/Group';
import Clear from '@mui/icons-material/Clear';

//Component
import SearchTextBox from './SearchTextBox';
import appTheme from '../theme';
import SpecialButton from './SpecialButton';
//
import {get} from '../API/Dhis2.js';
import i18n from '../locales/index.js' 


const styles = {
  paper: {
    height: 200,
    overflow: 'auto',
    width: '90%',
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  },
  textBox:{
    width: '90%',
    background:appTheme.palette.primary.canvasColor,
    margin: 20,
    position: "relative"
  },
  columnForEditButton: {
    width: '15%'
  },
  columnForMain: {
    width: '40%'
  },
  columnIcon: {
    width: 10
  },
  iconColor: appTheme.palette.primary.settingOptions.icon
}



class IndividualSharingSetting extends React.Component {


  constructor(props) {
    super(props);
    this.state = {
      sharingOption: {
        userAccesses: [],
        userGroupAccesses: []        
      },
      idSelectedforFilter:[]
    };
  }

  
  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI) {
    let result = {};
    try {
      let res = await get(urlAPI);
      return res;      
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }
  async searchUserGroups(valuetoSearch){
     return this.getResourceSelected("sharing/search?key="+valuetoSearch).then(res => {
       let users=[];
       let groups=[];
       res.users.forEach((user)=>{
         //filter that this object was been previously selected
         if(!this.state.idSelectedforFilter.includes(user.id))
              users.push({
                  id:user.id,
                  displayName:user.displayName,
                  data:{type:'user'}
                })
       })
      res.userGroups.forEach((group)=>{
        //filter that this object was been previously selected
        if(!this.state.idSelectedforFilter.includes(group.id))
            groups.push({
              id:group.id,
              displayName:group.displayName,
              data:{type:'group'}
            })
     })
      return users.concat(groups);
     })
  }
  //handle
  //change access each click
  HandleClickButton(data){
    let access={0:"--",1:"r-",2:"rw"}
    let {userAccesses,userGroupAccesses}=this.state.sharingOption;
    switch(data.type){
      case "USERMETADATA":
        userAccesses=this.state.sharingOption.userAccesses.map((user)=>{
          if(user.id==data.id){
              user.access=access[data.value]+user.access.substring(2, 4)+"----";
          }
          return user
        })
      break;
      case "GROUPMETADATA":
        userGroupAccesses=this.state.sharingOption.userGroupAccesses.map((group)=>{
          if(group.id==data.id){
            group.access=access[data.value]+group.access.substring(2, 4)+"----";
          }
          return group
        })
      break;
      case "USERDATA":
        userAccesses=this.state.sharingOption.userAccesses.map((user)=>{
          if(user.id==data.id){
            user.access=user.access.substring(0, 2)+access[data.value]+"----";
          }
          return user
        })
      break;
      case "GROUPDATA":
      userGroupAccesses=this.state.sharingOption.userGroupAccesses.map((group)=>{
        if(group.id==data.id){
          group.access=group.access.substring(0, 2)+access[data.value]+"----";         
        }
        return group
      })
      break;
    }
    this.setState({sharingOption:{userAccesses,userGroupAccesses}})
  }
  handleRemoveItem(id){
    this.setState({
      sharingOption:{userAccesses:this.state.sharingOption.userAccesses.filter((user)=>{
        if(user.id!=id)
          return (user);
      }),userGroupAccesses:this.state.sharingOption.userGroupAccesses.filter((group)=>{
        if(group.id!=id)
          return (group);
      })}
    })

      //remove filter
      let {idSelectedforFilter}=this.state;
      var i = idSelectedforFilter.indexOf( id );
      if ( i !== -1 ) {
        idSelectedforFilter.splice( i, 1 );
        this.setState({
          idSelectedforFilter
        });
      }
  }

  SelectUserOrGroup(valueSelected){
    let {idSelectedforFilter}=this.state;
    idSelectedforFilter.push(valueSelected.id)
    this.setState({
      idSelectedforFilter
    });
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
  componentDidUpdate(prevProp,prevState){
    if(prevState.sharingOption!=this.state.sharingOption)
      this.props.GroupSelected(this.state.sharingOption);
  }

  componentDidMount(){
    this.setState({sharingOption:this.props.currentSelected});
    //previus Selected
    let {idSelectedforFilter}=this.state;
    this.props.currentSelected.userAccesses.forEach((obj)=>{     
      idSelectedforFilter.push(obj.id)     
    })
    this.props.currentSelected.userGroupAccesses.forEach((obj)=>{     
      idSelectedforFilter.push(obj.id)     
    })
    //update state
    this.setState({
      idSelectedforFilter
    });
  }
  render() {
    var keyCount=0;
    return (
      <div style={{position: 'relative'}} >
        <div style={styles.paper}>
          <Table>

            <TableHead displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
              <TableRow>

                <TableCell columnNumber={2} style={styles.columnForMain} >{i18n.t(" User")}</TableCell>
                <TableCell style={styles.columnForEditButton}>{i18n.t(" METADATA")}</TableCell>
                <TableCell style={styles.columnForEditButton}> {i18n.t(" DATA")}</TableCell>
                <TableCell style={styles.columnForEditButton}></TableCell>
              </TableRow>
            </TableHead>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                this.state.sharingOption.userAccesses.map((option)=> {
                  keyCount++;
                  let access={"--":0,"r-":1,"rw":2}
                  let AccessMetadata=access[option.access.substring(0,2)];
                  let AccessData=access[option.access.substring(2,4)];
                 
                  return (
                    <TableRow key={option.id+"_"+keyCount}>
                      <TableCell style={styles.columnIcon}><User color={styles.iconColor} /></TableCell>
                      <TableCell><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableCell>
                      <TableCell style={styles.columnForEditButton}> <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"USERMETADATA"} enabled={true} defaultValue={AccessMetadata} /> </TableCell>
                      <TableCell style={styles.columnForEditButton}>
                      <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"USERDATA"} enabled={this.props.resource.sharingData} defaultValue={AccessData} title={i18n.t("Not available for this type of object")} />
                      </TableCell>
                      <TableCell style={styles.columnForEditButton}>
                      <Button
                        onClick={()=>this.handleRemoveItem(option.id)} 
                        icon={<Clear color={styles.iconColor} />}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
 
               {
                this.state.sharingOption.userGroupAccesses.map((option)=> {
                  let access={"--":0,"r-":1,"rw":2}
                  let AccessMetadata=access[option.access.substring(0,2)];
                  let AccessData=access[option.access.substring(2,4)];
                  return (
                    <TableRow key={option.id+"_"+keyCount}>
                      <TableCell style={styles.columnIcon}><Group color={styles.iconColor} /></TableCell>
                      <TableCell><span style={{ textColor: styles.iconColor }}>{option.displayName}</span></TableCell>
                      <TableCell style={styles.columnForEditButton}> <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"GROUPMETADATA"} enabled={true} defaultValue={AccessMetadata} /> </TableCell>
                      <TableCell style={styles.columnForEditButton}>
                      <SpecialButton id={option.id} color={styles.iconColor} callBackHandleClick={this.HandleClickButton.bind(this)} type={"GROUPDATA"} enabled={this.props.resource.sharingData} defaultValue={AccessData} title={i18n.t("Not available for this type of object")} />
                      </TableCell>
                      <TableCell style={styles.columnForEditButton}>
                      <Button
                        onClick={()=>this.handleRemoveItem(option.id)} 
                        icon={<Clear color={styles.iconColor} />}
                        />
                      </TableCell>
                    </TableRow>
                  )
                })}
            </TableBody>
          </Table>
          </div>
          <div style={styles.textBox}>
        <SearchTextBox 
        source={this.searchUserGroups.bind(this)} 
        title={i18n.t("Add users and user groups")} 
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


export default IndividualSharingSetting;