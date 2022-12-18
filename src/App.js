import React, { Component } from "react";
import {ToastContainer} from 'react-toastify';
import "./App.css";
import http from "./services/httpService";
import config from './config.json'
import 'react-toastify/dist/ReactToastify.css';

class App extends Component {
  state = {
    posts: []
  };

  async componentDidMount(){
   const {data: posts}= await http.get(config.apiEndPoint);
   this.setState({posts});
  };

  handleAdd =  async () => {
    const obj = {title:'a', body:'b'};
    const {data:post} = await http.post(config.apiEndPoint,obj);
    
    const posts = [post, ...this.state.posts];
    this.setState({posts});
  };

  handleUpdate = async post => {
    post.title = 'updated';
    await http.put(config.apiEndPoint + '/' + post.id,post);

    const posts = [...this.state.posts];
    const index = posts.indexOf(post);
    posts[index] = {...post};
    this.setState({posts});
  };

  handleDelete = async post => {

    const originalPosts = this.state.posts;

    const posts = this.state.posts.filter(p => p.id !== post.id );
    this.setState({posts});

    try{
      await http.delete('s'+config.apiEndPoint + '/' + post.id); //if delete + post.id and add 999 to after / => expected error =>This post has already been deleted
    //if add 's'+ to begining of config.apiEndPoint => unexpected error 
    }
    catch(err){
      if(err.response && err.response.status === 404){
        alert('This post has already been deleted');
        this.setState({posts:originalPosts});
      }
       
    }
   
  };

  render() {
    return (
      <React.Fragment>
        <ToastContainer/>
        <button className="btn btn-primary" onClick={this.handleAdd}>
          Add
        </button>
        <table className="table">
          <thead>
            <tr>
              <th>Title</th>
              <th>Update</th>
              <th>Delete</th>
            </tr>
          </thead>
          <tbody>
            {this.state.posts.map(post => (
              <tr key={post.id}>
                <td>{post.title}</td>
                <td>
                  <button
                    className="btn btn-info btn-sm"
                    onClick={() => this.handleUpdate(post)}
                  >
                    Update
                  </button>
                </td>
                <td>
                  <button
                    className="btn btn-danger btn-sm"
                    onClick={() => this.handleDelete(post)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </React.Fragment>
    );
  }
}

export default App;
