import React from 'react';

//MAterial UI
import TextField from 'material-ui/TextField';
import appTheme from '../theme';
import FontIcon from 'material-ui/FontIcon';
import { grey400 } from 'material-ui/styles/colors';


const styles = {
  container: {
    display: 'grid',
    gridTemplateColumns: '100% 50%',
  },
  item: {
    padding: -1,
   // border: '1px solid red'
  },
  icon: {
    padding: -1,
    justifySelf: 'end',
   // border: '1px solid red'
  },
  iconStyles: {
    marginRight: 24,
  }
}


class Filter extends React.Component {


  constructor(props) {
    super(props);
    this.state = { value: 'name' };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event, index, value) {
    this.setState({ value })
  };

  getChildContext() {
    return {
      d2: this.props.d2,
      muiTheme: appTheme
    };
  }

  renderTextLabel() {
    return (
      <section style={styles.container}>
        <div style={styles.item}>
          {this.props.d2.i18n.getTranslation('LABEL_SEARCHNAME')}
        </div>

        <div style={styles.icon}>
          <FontIcon className="material-icons" color={grey400} style={styles.iconStyles} >open_in_new</FontIcon>

        </div>
      </section>
    )
  }



  render() {
    const textlabel = this.renderTextLabel()
    return (
      <TextField
        fullWidth={true}
        hintText={textlabel}
        floatingLabelText={textlabel}
      />


    );
  }
}

Filter.propTypes = {
  d2: React.PropTypes.object.isRequired,
  label: React.PropTypes.string,
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