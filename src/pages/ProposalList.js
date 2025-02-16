import ProposalCard from "../components/ProposalCard"
import { Modal, } from 'react-bootstrap'
import VoteModal from "../components/VoteModal"
import { useCallback, useEffect, useState } from "react"
import { getProposals, } from "../helpers/getProposal"
import '../assets/css/ProposalList.css'
import { Link } from "react-router-dom"
import { Skeleton } from "antd"

const style = {
    container: {
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        textAlign: 'center',
        paddingBottom: '20px',
        padding: 140,
        paddingTop: 0
    },
    button: {
        marginTop: '3rem',
        textAlign: 'left',
    },
    breadcrumb: {
        textAlign: 'left',
        fontWeight: 700,
        fontSize: '24px',
        color: '#ffffff',
        fontFamily: 'Roboto',
        paddingBottom: '0.5em'
    },
    card: {
        backgroundColor: '#EEC13F',
        borderRadius: '15px',
        minHeight: 'auto',
        boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)',
        padding: '40px',
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)'
    },
}

const ProposalList = () => {
    const [show, setShow] = useState(false)
    const [proposals, setProposals] = useState([])
    const [selectProposal, setSelectProposal] = useState(-1)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        (async () => {
            setLoading(true)
            const res = await getProposals()
            const proposals = res.proposals
            proposals.sort((x, y) => y.proposal_id - x.proposal_id)
            setProposals([...proposals])
            setLoading(false)
        })()
    }, [])

    const wrapSetShow = useCallback((val) => {
        setShow(val)
    }, [setShow])

    const wrapSetSelect = useCallback((val) => {
        setSelectProposal(val)
    }, [setSelectProposal])

    const handleClose = () => {
        setShow(false)
    }

    return (
        <div style={style.container}>
            <div style={style.breadcrumb}>
                <span>
                    <Link to='/' style={{ color: '#ffffff', fontWeight: 500 }}>
                        Homepage
                    </Link>
                </span>
                <span style={{ color: '#ffffff', fontWeight: 500 }}>
                    {' / '}
                </span>
                <span style={{ color: '#ED9D26' }}>
                    Proposals
                </span>
            </div>
            <div style={{
                textAlign: 'left',
                fontSize: '48px',
                color: '#ffffff',
                fontFamily: 'Roboto',
                fontWeight: 700,
                marginBottom: '1.3em'
            }}>
                PROPOSALS
            </div>
            {loading && proposals.length === 0 ? (
                <div style={style.card}>
                <Skeleton active style={{
                    backgroundColor: '#ffffff',
                    padding: '30px',
                    borderRadius: '15px'
                }} />
            </div>
            ) : (
                <div className="gridBox">
                {(proposals.map((proposal, index) => (
                    <ProposalCard proposal={proposal} wrapSetShow={wrapSetShow} wrapSetSelect={wrapSetSelect} index={index} />
                )))}
            </div>
            )
            }
            <>
                <Modal show={show} onHide={handleClose} backdrop="static" >
                    <Modal.Header style={{
                            backgroundColor: '#4D4D4D',
                            color: '#EEC13F',
                            fontFamily: 'Roboto',
                            fontSize: '24px',
                            fontWeight: 400,
                            border: 0
                        }}>
                        <div>
                            Vote
                        </div>
                    </Modal.Header>
                    <Modal.Body style={{ backgroundColor: '#4D4D4D', }}>
                        <VoteModal proposal={proposals[selectProposal]} id={proposals[selectProposal] && proposals[selectProposal].proposal_id} wrapSetShow={wrapSetShow} />
                    </Modal.Body>
                </Modal>
            </>
        </div>
    )
}

export default ProposalList