import React, { Component } from "react";
import Remarkable from "remarkable";
import { Controlled as CodeMirror } from "react-codemirror2";
import "codemirror/lib/codemirror.css";
import "codemirror/theme/material.css";
import {
  Grid,
  IconButton,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  ListItemSecondaryAction,
  Typography
} from "@material-ui/core";
import { Delete, InsertDriveFile, Add } from "@material-ui/icons/";
import moment from "moment/moment";
import { getFiles, createFile, updateFile, deleteFile } from "../../api/file";

class MarkdownEditor extends Component {
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.handleGetFiles = this.handleGetFiles.bind(this);
    this.handleDeleteFile = this.handleDeleteFile.bind(this);
    this.handleCreateFile = this.handleCreateFile.bind(this);
    this.handleUpdateFile = this.handleUpdateFile.bind(this);
    this.state = { currentFile: {}, files: [] };
  }

  componentDidMount() {
    getFiles().then(data => {
      this.setState({ files: data.data });
    });
  }

  handleChange(e) {
    this.setState({ currentFile: e });
  }

  handleGetFiles() {
    getFiles()
      .then(data => {
        const { currentFile } = this.state;
        let newCurrentFile = {};
        if (
          currentFile &&
          Object.getOwnPropertyNames(currentFile).length !== 0
        ) {
          newCurrentFile = data.data.find(e => e._id === currentFile._id);
        }
        this.setState({ currentFile: newCurrentFile, files: data.data });
      })
      .catch(error => {
        console.error(error);
      });
  }

  handleDeleteFile(file) {
    if (window.confirm(`Are you sure you want to delete "${file.title}"`)) {
      deleteFile(file._id || file.id).then(() => this.handleGetFiles());
    }
  }

  handleCreateFile() {
    const { files } = this.state;
    var title = prompt("Please enter the name of the markdown");
    if(title )
        if (files.find(d => d.title.trim().toLowerCase() === title.trim().toLowerCase()))
            alert("the name of the markdown already exists");
        else
            createFile({ title, content: "" }).then(() => this.handleGetFiles());
  }

  handleUpdateFile(value) {
    const { currentFile } = this.state;
    const data = {
      title: currentFile.title,
      content: value
    };
    updateFile(currentFile._id, data).then(() => this.handleGetFiles());
  }

  getRawMarkup() {
    const { currentFile } = this.state;
    let render = currentFile ? currentFile.content : "";
    const md = new Remarkable();
    return { __html: md.render(render) };
  }

  render() {
    let options = {
      theme: "material",
      lineNumbers: true
    };

    const { currentFile, files } = this.state;

    return (
      <Grid container spacing={0} className="cont">
        <Grid item xs={2} className="bg-grey h-100 overauto">
          <Typography
            className="title-markdown"
            variant="h6"
            component="h3"
            align="center"
          >
            Markdown editor
          </Typography>
          <List component="nav">
            {files.map(d => (
              <ListItem
                key={d._id}
                selected={currentFile && currentFile._id === d._id}
                button
                onClick={() => this.handleChange(d)}
              >
                <ListItemIcon>
                  <InsertDriveFile />
                </ListItemIcon>
                <ListItemText
                  primary={d.title}
                  secondary={moment(d.createdAt).fromNow()}
                />
                <ListItemSecondaryAction>
                  <IconButton aria-label="Delete">
                    <Delete
                      className="btn-delete"
                      onClick={() => this.handleDeleteFile(d)}
                    />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
            <ListItem button onClick={() => this.handleCreateFile()}>
              <ListItemIcon>
                <Add />
              </ListItemIcon>
              <ListItemText primary="Add Markdown" />
            </ListItem>
          </List>
        </Grid>
        <Grid item xs={5} className="h-100 overauto">
          {currentFile &&
            currentFile._id &&
            files.length > 0 && (
              <CodeMirror
                value={currentFile ? currentFile.content : ""}
                options={options}
                onBeforeChange={(editor, data, value) => {
                  this.handleUpdateFile(value);
                }}
              />
            )}
        </Grid>
        <Grid item xs={5} className="h-100 overauto">
          <div className="p-2" dangerouslySetInnerHTML={this.getRawMarkup()} />
        </Grid>
      </Grid>
    );
  }
}

export default MarkdownEditor;
