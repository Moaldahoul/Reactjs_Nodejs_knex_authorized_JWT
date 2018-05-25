import React from 'react';
import axios from 'axios';


class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            error: ''
        };
        this.change = this.change.bind(this);
        this.submit = this.submit.bind(this);
    }

    change(e){
        this.setState({
            [e.target.name]: e.target.value
        });
    }
    submit(e){
        e.preventDefault();
        axios.post('/getToken', {
            email: this.state.email,
            password:this.state.password
        }).then(res => {
            localStorage.setItem('cool-jwt', res.data);
            this.props.history.push('/Protected');
        }).catch(()=> this.setState({
            error: true
        }));
    }

    render() {
        const { error } = this.state;
        return (
            <div>
                <from onSubmit={ e => this.submit(e)}  >
                <p><label>Email</label> <input type="text" name="email" 
                                            onChange={e => this.change(e)} /></p>
                <p><label>Password</label> <input type="password" name="password" 
                                                onChange={e => this.change(e)}/></p>
               <p><button type="submit"> Submit </button></p> 
                </from>

                {error && <p>Invalid credentials</p>}

            </div>
        );
    }
}


export default Login;


 