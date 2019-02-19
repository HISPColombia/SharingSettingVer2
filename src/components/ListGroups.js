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
import User from 'material-ui/svg-icons/social/person';
import Group from 'material-ui/svg-icons/social/group';

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
    this.state = {
      sharingOption: {
        userAccesses: [
          {
            access: "r-------",
            displayName: "Marko David Garcia 1",
            id: "hKNKkzXw92v",
            name: "Marko David Garcia"
          },
          {
            access: "r-------",
            displayName: "Helder Castrillon 1",
            id: "MZNoYkLK5iN",
            name: "Helder Castrillon",
          },
          {
            access: "r-------",
            displayName: "Marko David Garcia 2",
            id: "hKNKkzXw92v",
            name: "Marko David Garcia"
          },
          {
            access: "r-------",
            displayName: "Helder Castrillon 2",
            id: "MZNoYkLK5iN",
            name: "Helder Castrillon",
          },
          {
            access: "r-------",
            displayName: "Marko David Garcia 3",
            id: "hKNKkzXw92v",
            name: "Marko David Garcia"
          },
          {
            access: "r-------",
            displayName: "Helder Castrillon 3",
            id: "MZNoYkLK5iN",
            name: "Helder Castrillon",
          }
        ]
      }
    };
  }
  //API Query

  //query resource Selected
  async getResourceSelected(urlAPI, page) {
    const d2 = this.props.d2;
    const api = d2.Api.getApi();
    let result = {};
    try {
      let res = await api.get('/api/29/sharing/search?key=Marko' + urlAPI);
      if (res.hasOwnProperty(urlAPI)) {
        return res;
      }
    }
    catch (e) {
      console.error('Could not access to API Resource');
    }
    return result;
  }

  render() {
    const d2 = this.props.d2;
    return (
      <div >
        <div style={styles.paper}>
          <Table>

            <TableHeader displaySelectAll={false} adjustForCheckbox={this.props.Enabledchecked}>
              <TableRow>
                <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_USER_NAME")}</TableHeaderColumn>
                <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_METADATA_ACCESS")}</TableHeaderColumn>
                <TableHeaderColumn>{d2.i18n.getTranslation("TABLE_DATA_ACCESS")}</TableHeaderColumn>
              </TableRow>
            </TableHeader>
            <TableBody displayRowCheckbox={false} showRowHover={true}>
              {
                this.state.sharingOption.userAccesses.map(function(option) {
                  return(
                    <TableRow>
                    <TableRowColumn><User/>{option.displayName}</TableRowColumn>
                    <TableRowColumn> <SpecialButton /></TableRowColumn>
                    <TableRowColumn>
                      <SpecialButton />
                    </TableRowColumn>
                  </TableRow>
                  )
              })}

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