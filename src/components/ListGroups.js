import React from 'react';

//Material UI
import TextField from 'material-ui/TextField';
import appTheme from '../theme';
import SpecialButton from './SpecialButton'
import {
    Table,
    TableBody,
    TableRow,
    TableRowColumn,
  } from 'material-ui/Table';
import Paper from 'material-ui/Paper';
//Component

const styles = {
    paper:{
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
    this.state = {value: 'name'};
  }

  
  render() {
    return (
        <div >
            <div style={styles.paper}>
                <Table>
                <TableBody displayRowCheckbox={false} showRowHover={true}>
                    <TableRow>
                        <TableRowColumn>1</TableRowColumn>
                        <TableRowColumn>John Smith</TableRowColumn>
                        <TableRowColumn>
                            <SpecialButton/>
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