import {useState} from 'react'
import {FaUser} from 'react-icons/fa'
import {useMutation} from '@apollo/client'
import {ADD_CLIENT} from '../mutations/clientMutations'
import {GET_CLIENTS} from '../queries/clientQueries'

export default function AddClientModal(){
    const [name, setName]=useState('')
    const [email, setEmail] =useState('')
    const [phone, setPhone] =useState('')
    const [addClient]= useMutation(ADD_CLIENT, {

        variables: {name: name, email: email, phone: phone},

        update(cache, {data: {addClient}}){
            const {clients} = cache.readQuery({query: GET_CLIENTS})
            cache.writeQuery({
                query: GET_CLIENTS,
                data: {clients: [...clients, addClient]}
            })
        }
    })
    const onSubmit=(e)=>{
        e.preventDefault()
        console.log(name, email, phone)

        if(name===''|| email===''|| phone===''){
            return alert("Please fill All")
        }
        addClient(name, email, phone)
        .catch(err=>{
            console.log("Error: ", err)
        })
        setPhone('')
        setName('')
        setEmail('')
    }
    return (
        <>
        <button 
        className='btn btn-secondary'
        data-bs-toggle='modal'
        data-bs-target="#addClientModal">
            <div className='d-flex align-items-center'>
                <FaUser className='icon'/>
                <div>Add Client</div>
            </div>
        </button>
        <div 
        className='modal fade'
        id='addClientModal'
        >
            <div className="modal-dialog">
                <div className="modal-content">
                    <div className="modal-header">
                        <h5 className="modal-header border bg-primary" id="addClientModalLabel">
                            Add Client
                        </h5>
                        <button 
                        type='button'
                        className='btn-close'
                        data-bs-dismiss='modal'
                        ></button>
                    </div>
                    <div className='modal-body'>
                        <form onSubmit={onSubmit}>
                            <div className='mb-3'>
                                <label className='form-label'>Name</label>
                                <input 
                                type='text'
                                className='form-control'
                                id='name'
                                value={name}
                                onChange={(e)=>setName(e.target.value)}/>
                            </div>
                            <p>{name}</p>
                            <div className='mb-3'>
                                <label className='form-label'>Email</label>
                                <input 
                                type='email'
                                className='form-control'
                                id='email'
                                value={email}
                                onChange={(e)=>setEmail(e.target.value)}/>
                            </div>
                            <p>{email}</p>
                            <div className='mb-3'>
                                <label className='form-label'>Phone</label>
                                <input 
                                type='text'
                                className='form-control'
                                id='phone'
                                value={phone}
                                onChange={(e)=>setPhone(e.target.value)}/>
                            </div>
                            <p>{phone}</p>
                            <button 
                            type='submit'
                            data-bs-dismiss='modal'
                            className='btn btn-secondary'>
                                Submit
                            </button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
        </>
    )
}