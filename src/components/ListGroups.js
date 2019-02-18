import React from 'react';

//Material UI
import TextField from 'material-ui/TextField';
import appTheme from '../theme';
import SpecialButton from './SpecialButton'
import {
  Table,
  TableBody,
  TableHeader,
  TableHeaderColumn,
  TableRow,
  TableRowColumn,
} from 'material-ui/Table';
import Paper from 'material-ui/Paper';
//Component

const styles = {
  paper: {
    height: 10,
    width: '90%',
    margin: 20,
    textAlign: 'center',
    display: 'inline-block',
  }

}



class ListGroups extends React.Component {


  constructor(props) {
    super(props);
    this.state = { value: 'name' };
  }


  render() {
    const d2=this.props.d2;
    return (
      <div >
        <div style={styles.paper}>
          <Table>
           
              <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
                <TableRow>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_NAME")}</TableHeaderColumn>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_PUBLICACCESS")}</TableHeaderColumn>
                  <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_EXTERNALACCESS")}</TableHeaderColumn>
                 </TableRow>
              </TableHeader>
              <TableBody displayRowCheckbox={false} showRowHover={true}>
              <TableRow>
                <TableRowColumn>1</TableRowColumn>
                <TableRowColumn>John Smith</TableRowColumn>
                <TableRowColumn>
                  <SpecialButton />
                </TableRowColumn>
              </TableRow>
            </TableBody>
          </Table>
        </div>
      </div>
    );
  }
}

ListGroups.propTypes = {
  d2: React.PropTypes.object.isRequired,
};


export default ListGroups