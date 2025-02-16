import { useEffect, useState } from "react"
import { getVotes } from "../helpers/getProposal"
import { Typography, Tooltip, Skeleton } from 'antd';
import { Modal } from 'react-bootstrap';
import { Link } from 'react-router-dom';

const { Title, Paragraph } = Typography;

const style = {
    voteBarContainer: {
        display: 'flex',
        justifyContent: 'center',
        minHeight: '14%',
        marginBottom: '1em',
        color: '#ffffff',
        padding: 20,
        paddingTop: 0
    },
    voteBar: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'start',
        width: '100%',
        borderRadius: '50px',
        backgroundColor: '#cccccc',
    },
    container: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: 20,
        paddingTop: 20,
    },
    table: {
        width: '100%',
    },
    tdlHeader: {
        backgroundColor: 'transparent',
        borderBottom: 'solid 1px black'
    },
    tdlContent: {
        marginTop: '0px',
        borderRadius: '50px',
        paddingTop: 0
    },
    th: {
        padding: '15px 15px',
        textAlign: 'left',
        fontWeight: '700',
        fontSize: '15px',
        color: '#000000',
        textTransform: 'uppercase',
        fontFamily: 'Roboto',
    },
    td: {
        padding: '15px',
        textAlign: 'left',
        verticalAlign: '500',
        fontWeight: 'lighter',
        fontSize: '17px',
        color: '#000000',
        fontFamily: 'Roboto',
        width: '20%',
        lineHeight: '18px'
    }
}

const VoterList = ({ proposal }) => {
    const [loading, setLoading] = useState(false)
    const [voters, setVoters] = useState([])

    useEffect(() => {
        (async () => {
            setLoading(true)
            const res = await getVotes(proposal.id)
            const voters = res.votes
            setVoters([...voters])
            setLoading(false)
        })()
    }, [])

    const getPercentage = (vote) => {
        if (proposal.tally !== undefined) {
            const sum = parseInt(proposal.tally.yes)
                + parseInt(proposal.tally.no_with_veto)
                + parseInt(proposal.tally.no)
                + parseInt(proposal.tally.abstain)

            return sum !== 0 && parseFloat(parseInt(vote) * 100 / sum).toFixed(1) || 0
        }
        else {
            const sum = parseInt(proposal.final_tally_result.yes)
                + parseInt(proposal.final_tally_result.no_with_veto)
                + parseInt(proposal.final_tally_result.no)
                + parseInt(proposal.final_tally_result.abstain)

            return sum !== 0 && parseFloat(parseInt(vote) * 100 / sum).toFixed(1) || 0
        }
    }

    const getOption = (option) => {
        if (option === 'VOTE_OPTION_NO') return 'No'
        if (option === 'VOTE_OPTION_YES') return 'Yes'
        if (option === 'VOTE_OPTION_NO_WITH_VETO') return 'No With Veto'
        else return 'Abstain'
    }

    return (
        <div style={{ 
            backgroundColor: '#ffffff', 
            padding: '0.5em', 
            borderRadius: '15px',
            boxShadow: '0px 0px 10px 2px rgba(0, 0, 0, 0.25)' 
        }}>
            <div style={style.container}>
                <Title style={{ color: '#000000', fontSize: '24px', fontWeight: 700, fontFamily: 'Roboto' }}>
                    Voters
                </Title>
            </div>
            <div style={style.voteBarContainer}>
                <div style={style.voteBar}>
                    <div style={{
                        width: `${proposal.tally !== undefined
                            ? getPercentage(proposal.tally.yes) :
                            getPercentage(proposal.final_tally_result.yes)
                            }%`,
                        backgroundColor: '#2A9D8F',
                        minHeight: '100%',
                    }}>
                        {proposal.tally !== undefined ? getPercentage(proposal.tally.yes) != 0.0
                            && `${getPercentage(proposal.tally.yes)}%` :
                            getPercentage(proposal.final_tally_result.yes) != 0.0
                            && `${getPercentage(proposal.final_tally_result.yes)}%`}
                    </div>
                    <div style={{
                        width: `${proposal.tally !== undefined
                            ? getPercentage(proposal.tally.no) :
                            getPercentage(proposal.final_tally_result.no)
                            }%`,
                        backgroundColor: '#E9C46A',
                        minHeight: '100%'
                    }}>
                        {proposal.tally !== undefined ? getPercentage(proposal.tally.no) != 0.0
                            && `${getPercentage(proposal.tally.no)}%` :
                            getPercentage(proposal.final_tally_result.no) != 0.0
                            && `${getPercentage(proposal.final_tally_result.no)}%`}
                    </div>
                    <div style={{
                        width: `${proposal.tally !== undefined
                            ? getPercentage(proposal.tally.abstain) :
                            getPercentage(proposal.final_tally_result.abstain)
                            }%`,
                        backgroundColor: '#9CB7D3',
                        minHeight: '100%',

                    }}>
                        {proposal.tally !== undefined ? getPercentage(proposal.tally.abstain) != 0.0
                            && `${getPercentage(proposal.tally.abstain)}%` :
                            getPercentage(proposal.final_tally_result.abstain) != 0.0
                            && `${getPercentage(proposal.final_tally_result.abstain)}%`}
                    </div>
                    <div style={{
                        width: `${proposal.tally !== undefined
                            ? getPercentage(proposal.tally.no_with_veto) :
                            getPercentage(proposal.final_tally_result.no_with_veto)
                            }%`,
                        backgroundColor: '#E76F51',
                        minHeight: '100%',
                    }}>
                        {proposal.tally !== undefined ? getPercentage(proposal.tally.no_with_veto) != 0.0
                            && `${getPercentage(proposal.tally.no_with_veto)}%` :
                            getPercentage(proposal.final_tally_result.no_with_veto) != 0.0
                            && `${getPercentage(proposal.final_tally_result.no_with_veto)}%`}
                    </div>
                </div>
            </div>
            {!loading ? proposal.status < 3 && (
                <div style={{ backgroundColor: 'rgb(255, 255, 255, 1)', borderRadius: '20px', padding: '2em' }}>
                    <table cellPadding="0" cellSpacing="0" border="0" style={style.table}>
                        <thead style={style.tdlHeader}>
                            <tr>
                                <th style={{ ...style.th, width: '20%' }}>Voter</th>
                                <th style={{ ...style.th, width: '10rem' }}>Option</th>
                            </tr>
                        </thead>
                        <tbody style={style.tdlContent}>
                            {voters.map((vote, index) => {
                                return (
                                    <tr key={index} style={{ backgroundColor: '#ffffff' }}>
                                        <td style={style.td}>
                                            <Link to={`../accounts/${vote.voter}`}>
                                                {vote.voter}
                                            </Link>
                                        </td>
                                        <td style={style.td}>
                                            {vote.option && getOption(vote.option)}
                                        </td>
                                    </tr>
                                )
                            })}
                        </tbody>
                    </table>
                </div>
            ) : (
                <div style={{ padding: '30px' }}>
                    <Skeleton active />
                </div>
            )}
        </div>
    )
}

export default VoterList