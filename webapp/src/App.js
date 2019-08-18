import React from 'react';
import Select from 'react-select';
import DropzoneComponent from 'react-dropzone-component';
import LaddaButton, { XL, EXPAND_LEFT } from 'react-ladda';
import './App.css'
import "dropzone/dist/dropzone.css";
import "react-dropzone-component/styles/filepicker.css";

const baseUrl = "";

const componentConfig = {
  iconFiletypes: ['.ear', '.war'],
  showFiletypeIcon: true,
  postUrl: baseUrl+"/deploy/upload"
};

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedApp: null,
      loading: false,
      files : [],
      availableApps : []
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.addFile = this.addFile.bind(this);
    this.onUploadError = this.onUploadError.bind(this);
    this.onUploadSuccess = this.onUploadSuccess.bind(this);
    
  }

  componentDidMount() {
    fetch(baseUrl+'/deploy/apps')
      .then(response => response.json(), error => alert("error when getting data", error))
      .then(apps => {
          if(apps) {
            console.log(apps);
            this.setState({ availableApps : apps.map(a=> { return {value:a.id, label:a.name} }) });
          } else {
            console.log("no application found");
          }
        }, error => alert("error when processing data", error));
  }
  
  handleChange = selectedApp => {
    this.setState({ selectedApp });
  };

  djsConfig = { 
    autoProcessQueue: false,
    addRemoveLinks: true,
    acceptedFiles: ".war,.ear"
  }

  addFile =  file => {
      this.setState(state => {
        return {
          files : state.files.concat(file),
        }
      });
  }

  onUploadError(error){
    this.setState({
      loading: !this.state.loading,
      progress: 0.7,
    });
    alert("Error submitting form!", error);
  }

  onUploadSuccess(res){
    this.setState({
      loading: !this.state.loading,
      progress: 0.,
    });
    if (res.ok) {
    } else if (res.status === 401) {
      alert("Oops! ");
    }
  }

  uploadEventHandlers = {
    addedfile: this.addFile
  }

  handleSubmit() {
    if(!this.state.selectedApp){
      alert("select an app please !!");
      return;
    }
    this.setState({
      loading: true,
      progress: 0.7,
    });
    const data = new FormData();
    var i = 0;
    console.log(this.state.selectedApp.value);
    data.append('app', this.state.selectedApp.value);
    this.state.files.forEach(file  => {
      data.append('file'+i, file);
      i++;
    });
    console.log(data.keys);
    fetch(baseUrl+"/deploy", {
      mode: 'no-cors',
      method: "POST",
      body: data
    }).then(this.onUploadSuccess, this.onUploadError);
  }

  render() {

    return (
      <div id="background"> 
        <form onSubmit={this.handleSubmit}>
          <div > 
            <Select
              className="z"
              value={this.state.selectedApp} 
              onChange={this.handleChange}
              options={this.state.availableApps}
            />
              <DropzoneComponent config={componentConfig}
                          eventHandlers={this.uploadEventHandlers}
                          djsConfig={this.djsConfig} />
            <LaddaButton
              loading={this.state.loading}
              onClick={this.handleSubmit}
              data-color="green"
              data-size={XL}
              data-style={EXPAND_LEFT}
              data-spinner-size={30}
              data-spinner-color="#ddd"
              data-spinner-lines={12}
            >
            Deploy
          </LaddaButton>
          </div>
        </form>
      </div>
    );
  }
}

export default App;
