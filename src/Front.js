//DHIS2 component
import i18n from './locales/index.js'

//Material Components
import appTheme from './theme';

//Components
import ListSection from './data/listSections.json'
import Content from './components/Content'

import SideMenu from './components/SideMenu';



let currentSection;
let sidebarRef;

const stylesLocal = {
  hidde: {
    background: 'gray',
    width: 290,
    height: '100%',
    position: 'absolute',
    opacity: '0.3',
    zIndex: 100
  }
}

class AppFront extends React.Component {

  constructor(props, context) {
    super(props, context);

    this.state = {
      snackbarMessage: '',
      showSnackbar: false,
      formValidator: undefined,
      sectionToRender: '',
      informationResource: {},
      textSearch: "",
      hiddenSlide: true
    };

    this.changeSectionHandler = this.changeSectionHandler.bind(this);
    this.changeSearchTextHandler = this.changeSearchTextHandler.bind(this);
  }

  // functions
  //hander of seleccion in islide
  changeSectionHandler(key, searchText) {
    currentSection = key;
    if (key !== 'search' && sidebarRef) {
      sidebarRef.clearSearchBox();
    }

    this.setResourceSelected(currentSection);
  }

  //search resource on json file using the key
  setResourceSelected(keySelected) {
    let resourceSelected = ListSection.sections.find(function (resource) {
      return resource.label === keySelected;
    });
    this.setState(
      {
        informationResource: resourceSelected,
        sectionToRender: currentSection,
        textSearch: ""
      });
  }
  changeSearchTextHandler(searchText) {
    this.setState({ textSearch: searchText });
  }

  componentDidMount() {
    this.setState({ sectionToRender: ListSection.sections[0].label, informationResource: ListSection.sections[0] });
  }

  storeRef(ref) {
    sidebarRef = ref;
  }

  // // life cycle
  // getChildContext() {
  //   return {
  //     d2: this.props.d2,
  //     muiTheme: appTheme
  //   };
  // }

  disableSlide(mode) {
    if (mode == 'edit') {
      this.setState({ hiddenSlide: false })
    }
    else {
      this.setState({ hiddenSlide: true })
    }
  }
  render() {
    const d2 = this.props.d2;
    const iconStyles = {
      marginRight: 24,
    };

    return (

      <>      
          {
            this.state.hiddenSlide
              ? ""
              : <div style={stylesLocal.hidde} ></div>

          }
        <div className="app-wrapper">
          <SideMenu sections={
            ListSection.sections.map((section) => {
              let label = i18n.t(section.label)
              let key = section.label
              return ({ key, label })

            }).filter(section => section.label.includes(this.state.textSearch) == true || this.state.textSearch == "")
          }
            currentSection={this.state.sectionToRender}
            onChangeSection={this.changeSectionHandler}
            onChangeSearchText={this.changeSearchTextHandler}
          />


          <Content
            title={this.state.sectionToRender}
            informationResource={this.state.informationResource}
            disableSlide={this.disableSlide.bind(this)}
          />

        </div>
      </>
    );
  }
}


export default AppFront;

