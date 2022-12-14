import {Fragment, useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";

import {useGetSubjNameMutation} from "../../../../redux/api/articles";

import {
    Backdrop,
    Box, CircularProgress,
    Collapse,
    IconButton,
    Paper,
    styled,
    Table,
    TableBody,
    TableCell,
    TableContainer,
    TableHead,
    TableRow,
} from "@mui/material";

import {
    KeyboardArrowDown as KeyboardArrowDownIcon,
    KeyboardArrowUp as KeyboardArrowUpIcon,
} from "@mui/icons-material";

import {
    getStatusNameById,
    getTypeNameById,
    getCampaignsStats,
} from "../../helpers";

import {
    filterRows,
    formatPrice,
    isUndefined,
    removeArrayDuplicates,
    removeArrayUndefined,
    roundNumber,
} from "../../../../utils";
import {useSelector} from "react-redux";

const CustomizedTableContainer = styled(TableContainer)({
    ".MuiTable-root th, .MuiTable-root td": {
        border: "1px solid #e0e0e0",
    },
    "thead.MuiTableHead-root": {
        background: "#9cbfcb",
    },
});

const Row = ({row}) => {
    const navigate = useNavigate();

    const [open, setOpen] = useState(false);
    return (
        <Fragment>
            <TableRow sx={{"& > *": {borderBottom: "unset"}}}>
                <TableCell>
                    <IconButton size="small" onClick={() => setOpen(!open)}>
                        {open ? <KeyboardArrowUpIcon/> : <KeyboardArrowDownIcon/>}
                    </IconButton>
                </TableCell>

                <TableCell component="th" scope="row">
                    {row.article.article}
                </TableCell>

                <TableCell align="right">{row.article.subjName}</TableCell>
                <TableCell align="right">{formatPrice(row.campaigns.length)}</TableCell>
                <TableCell align="right">{formatPrice(row.stats.Views)}</TableCell>
                <TableCell align="right">{formatPrice(row.stats.Clicks)}</TableCell>
                <TableCell align="right">{roundNumber(row.stats.Ctr, 2)}</TableCell>
                <TableCell align="right">
                    {formatPrice(Math.ceil(row.stats.Cpc))}
                </TableCell>
                <TableCell align="right">
                    {formatPrice(Math.ceil(row.stats.spent))}
                </TableCell>
                <TableCell align="right">{formatPrice(row.stats.orders)}</TableCell>
                <TableCell align="right">
                    {formatPrice(Math.ceil(row.stats.target))}
                </TableCell>
            </TableRow>

            <TableRow>
                <TableCell style={{padding: 0}} colSpan={11}>
                    <Collapse in={open} timeout="auto" unmountOnExit>
                        <Box>
                            <Table size="small">
                                <TableHead>
                                    <TableRow>
                                        <TableCell>????????????</TableCell>
                                        <TableCell>?????? ??????????????</TableCell>
                                        <TableCell>????????????????</TableCell>
                                        <TableCell>????????????</TableCell>
                                        <TableCell>?????????? ?? ????????</TableCell>
                                        <TableCell>???????????? (CPM, ???)</TableCell>
                                        <TableCell>????????????</TableCell>
                                        <TableCell>??????????</TableCell>
                                        <TableCell>CTR</TableCell>
                                        <TableCell>????. ???????? ??????????</TableCell>
                                        <TableCell>??????????????????</TableCell>
                                        <TableCell>????????????</TableCell>
                                        <TableCell>???????? ????????</TableCell>
                                    </TableRow>
                                </TableHead>

                                <TableBody>
                                    {row.campaigns.map((row, index) => (
                                        <TableRow
                                            key={index}
                                            onClick={() => navigate(`/edit/${row.Id}`)}
                                        >
                                            <TableCell component="th" scope="row">
                                                {getStatusNameById(row.statusId)}
                                            </TableCell>
                                            <TableCell>{getTypeNameById(row.Type)}</TableCell>
                                            <TableCell>{row.CampaignName}</TableCell>
                                            <TableCell>
                                                {!isUndefined(row.budget) ? row.budget.budget : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.budget)
                                                    ? row.budget.dailyBudget
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.Cpm)
                                                    ? formatPrice(Math.ceil(row.Cpm))
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.Views) ? formatPrice(row.Views) : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.Clicks)
                                                    ? formatPrice(row.Clicks)
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.Ctr)
                                                    ? formatPrice(roundNumber(row.Ctr, 2))
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.Cpc)
                                                    ? formatPrice(Math.ceil(row.Cpc))
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.spent)
                                                    ? formatPrice(Math.ceil(row.spent))
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.orders)
                                                    ? formatPrice(row.orders)
                                                    : "-"}
                                            </TableCell>
                                            <TableCell>
                                                {!isUndefined(row.target)
                                                    ? formatPrice(Math.ceil(row.target))
                                                    : "-"}
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </Box>
                    </Collapse>
                </TableCell>
            </TableRow>
        </Fragment>
    );
};

export const SortedArticleTable = ({rows}) => {
    const [
        getSubjName,
        {
            data: subjNameData,
            isLoading: isGetSubjNameLoading,
            isSuccess: isGetSubjNameSuccess,
        },
    ] = useGetSubjNameMutation();

    const filterStatus = useSelector((state) => state.campaign.filterStatus);
    const newRows = filterRows(rows,filterStatus);

    const [campaigns, setCampaigns] = useState([]);

    useEffect(() => {
        const articles = removeArrayDuplicates(newRows.map(({nms}) => nms).flat(1));

        getSubjName({articles});
    }, []);

    useEffect(() => {
        if (!isGetSubjNameSuccess) return;

        const campaignsSortedByArticle = subjNameData.map((articleItem) => ({
            article: articleItem,
            campaigns: removeArrayUndefined(
                newRows.map((campaign) => {
                    const isArticleExists =
                        campaign.nms.findIndex(
                            (_article) => _article === articleItem.article
                        ) !== -1;

                    if (isArticleExists) {
                        return campaign;
                    }
                })
            ),
        }));

        const campaignsSortedByArticleWithStats = campaignsSortedByArticle.map(
            (sortedCampaign) => ({
                ...sortedCampaign,
                stats: getCampaignsStats(sortedCampaign.campaigns),
            })
        );

        setCampaigns(campaignsSortedByArticleWithStats);
    }, [isGetSubjNameSuccess,filterStatus]);

    return (
        <>
            <CustomizedTableContainer
                className="campaign-list__table-sorted-by-article"
                component={Paper}
            >
                <Table size="small">
                    <TableHead>
                        <TableRow>
                            <TableCell/>
                            <TableCell>??????????????</TableCell>
                            <TableCell align="right">??????????????</TableCell>
                            <TableCell align="right">????????????????</TableCell>
                            <TableCell align="right">????????????</TableCell>
                            <TableCell align="right">??????????</TableCell>
                            <TableCell align="right">CTR</TableCell>
                            <TableCell align="right">????. ???????? ??????????</TableCell>
                            <TableCell align="right">??????????????????</TableCell>
                            <TableCell align="right">????????????</TableCell>
                            <TableCell align="right">???????? ????????</TableCell>
                        </TableRow>
                    </TableHead>
                    <TableBody>
                        {campaigns &&
                        campaigns.map((row, index) => {
                            if (row.campaigns.length) {
                                return <Row key={index} row={row}/>
                            }
                        })
                        }
                    </TableBody>
                </Table>
            </CustomizedTableContainer>
            <Backdrop
                sx={{
                    position: "absolute",
                    backgroundColor: "#8c8c8c80",
                    color: "#fff",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={isGetSubjNameLoading}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </>
    );
};
