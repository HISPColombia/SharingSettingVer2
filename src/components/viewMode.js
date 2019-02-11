import React from 'react';
import NaviateNext from 'material-ui/svg-icons/image/navigate-next';
import NaviateBefore from 'material-ui/svg-icons/image/navigate-before';
import IconButton from 'material-ui/IconButton';
import Check from 'material-ui/svg-icons/navigation/check'
import Remove from 'material-ui/svg-icons/content/remove'
import Find from 'material-ui/svg-icons/action/find-in-page'
import Edit from 'material-ui/svg-icons/image/edit';
import Filter from './Filter'
import appTheme from '../theme';
import {
    Table,
    TableBody,
    TableHeader,
    TableHeaderColumn,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';

  const styles = {
    header: {
      fontSize: 24,
      fontWeight: 300,
      color: appTheme.rawTheme.palette.textColor,
      padding: '24px 0 12px 16px',
    },
    headline: {
      fontSize: 24,
      paddingTop: 16,
      marginBottom: 12,
      fontWeight: 400,
    },
    containterfooter: {
      display: 'grid',
      gridTemplateColumns: 'auto 100px 140px',
      gridTemplateRows: 'auto'
    },
    ItemFooter: {
      fontSize: 14,
      alignSelf: 'center',
      justifySelf: 'end'
    },
    tablerow:{
      wordWrap: 'break-word',
      whiteSpace: 'normal'
    },
    dataEdit: appTheme.settingOptions.write
    ,
    dataView:appTheme.settingOptions.read
    ,
    dataNoAccess:appTheme.settingOptions.blocked

  };
  

class ViewObjects extends React.Component {



    constructor(props) {
        super(props);
        }

    //handler
      //pagernextHandle
  handleNextPage(){
    this.setState({currentPage:this.state.currentPage+1})
  }
  handleBeforePage(){
    if(this.state.currentPage>1)
      this.setState({currentPage:this.state.currentPage-1})
  }
  //methods
    resolveAccessMessage(access, type){
        const publicAccessStatus={
          "rw":"CAN_EDIT",
          "r-":"CAN_VIEW",
          "--":"NO_ACCESS",
        }
        let metaDataAccess=access[0]+access[1];
        let DataAccess=access[2]+access[3];
        if(type=="data"){
          return publicAccessStatus[DataAccess];
        }
        else{
          return publicAccessStatus[metaDataAccess];
        }
      }
    renderResultInTable() {
        let rows = "";
        let keysCount=0;
        //convert object to array
        const rowRaw = Object.values(this.props.listObject);
        //
        const d2 = this.props.d2;
        const funResolvMessage=this.resolveAccessMessage;
        return rowRaw.map((row)=> {
            keysCount++;
          return (<TableRow>
            <TableRowColumn style={styles.tablerow}>{row.displayName}</TableRowColumn>
            <TableRowColumn style={styles.tablerow}>{d2.i18n.getTranslation(funResolvMessage(row.publicAccess,"metadata"))}</TableRowColumn>
            <TableRowColumn style={styles.tablerow}>{row.externalAccess?<Check/>:<Remove/>}</TableRowColumn>
            <TableRowColumn style={styles.tablerow}>
                   
            {row.userGroupAccesses.map(function(ug){
              return(
              <div key={"div"-ug.id} title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(ug.access,"metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(ug.access,"data"))}>
              <Find key={"fn"-ug.id} color={ug.access[1]=="w"?styles.dataEdit:styles.dataView}/>
              <Edit key={"ed"-ug.id} color={ug.access[3]=="w"?styles.dataEdit:ug.access[2]=="r"?styles.dataView:styles.dataNoAccess}/> {ug.displayName}
              </div>)
            })}
             </TableRowColumn>
             <TableRowColumn style={styles.tablerow}>
            {row.userAccesses.map(function(us){
                return(
                    <div key={"div"-us.id} title={"METADATA: " + d2.i18n.getTranslation(funResolvMessage(us.access,"metadata")) + " DATA:" + d2.i18n.getTranslation(funResolvMessage(us.access,"data"))}>
                    <Find key={"fn"-us.id} color={us.access[1]=="w"?styles.dataEdit:styles.dataView}/>
                    <Edit key={"ed"-us.id} color={us.access[3]=="w"?styles.dataEdit:us.access[2]=="r"?styles.dataView:styles.dataNoAccess}/> {us.displayName}
                    </div>)
            })}
            </TableRowColumn>
          </TableRow>)
        })
    
      }
    render(){
        const d2 = this.props.d2;
        return (
            <div>
            <Filter d2={d2} />
            <Table>
              <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
                <TableRow>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_NAME")}</TableHeaderColumn>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_PUBLICACCESS")}</TableHeaderColumn>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_EXTERNALACCESS")}</TableHeaderColumn>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_SHARINGGROUP")}</TableHeaderColumn>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_SHARINGUSER")}</TableHeaderColumn>
                </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={this.props.Enabledchecked} showRowHover={true}>
                {Object.keys(this.props.listObject).length > 0 ? this.renderResultInTable() : ""}
              </TableBody>
            </Table>
            <br />
            <div style={styles.containterfooter}>
              <div style={styles.ItemFooter}></div>
              <div style={styles.ItemFooter}>
                {1 + 50 * (this.props.pager.page-1)} - {50 * this.props.pager.page} of {this.props.pager.total}
              </div>
              <div style={styles.ItemFooter}>
                <IconButton disabled={this.props.pager.page==1?true:false}>
                  <NaviateBefore onClick={() => this.handleBeforePage()} />
                </IconButton>
                <IconButton disabled={this.props.pager.page==this.props.pager.pageCount?true:false}>
                  <NaviateNext onClick={() =>this.handleNextPage()}/>
                </IconButton>
              </div>
            </div>
          </div>
        )
        
    }

};
ViewObjects.propTypes = {
    d2: React.PropTypes.object.isRequired,
    listObject: React.PropTypes.object,
    pager: React.PropTypes.object,
    Enabledchecked: React.PropTypes.bool
  };
export default ViewObjects ;