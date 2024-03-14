import moment from "moment";
import jobModel from "../models/jobModel.js";
import userModel from "../models/userModel.js";
import mongoose from "mongoose";

export default class JobController {
    async getAllJobs(req, res, next) {
        try {
            console.log(req.user.userId);
            const jobs = await jobModel.find({ createdBy: req.user.userId });
            res.status(200).send({
                status: "success",
                body: jobs,
            });
        } catch (error) {
            next(error);
        }
    }

    async createJob(req, res, next) {
        try {
            console.log(req.body);
            const { title, company, position } = req.body;
            if (!title || !company || !position) next("All field is required");
            req.body.createdBy = req.user.userId;

            const job = await jobModel.create(req.body);
            return res.status(200).send({
                job,
                msg: "Job created successfully",
            });
        } catch (error) {
            next(error);
        }

        console.log("ino api call");
    }

    async updateJob(req, res, next) {
        console.log("dsadsadasd");
        try {
            const { id } = req.params;
            const { title, company, position } = req.body;
            console.log(req.body);
            console.log(id);
            const job = await jobModel.findOne({ _id: id });
            //checking for owner of the post
            if (!job) next("No job found");
            if (!job.createdBy == req.user.userId)
                next("You are not authorized to perform this action");
            else {
                console.log("here");
                const updateJob = await jobModel.findOneAndUpdate(
                    { _id: id },
                    req.body,
                    { new: true, runValidators: true }
                );
                console.log("here");
                return res.status(200).send({
                    success: true,
                    body: updateJob,
                });
            }
        } catch (error) {
            next(error);
        }
    }

    async filterJob(req, res, next) {
        const { status, type, search, sort } = req.query;
        console.log(status);
        console.log(type);

        const queryObject = {
            createdBy: req.user.userId,

        }


        //logic
        if (status && status !== "all") {
            queryObject.status = status;
        }
        if (type && type !== "all") {
            queryObject.workType = type;
        }
        if (search) {
            queryObject.position = {
                $regex: search,
                $options: 'i'
            }
        }

        // Sort
        let jobs = jobModel.find(queryObject);
        if (sort === "latest") {
            jobs = jobs.sort("-createdAt")
        }
        if (sort === "oldest") {
            jobs = jobs.sort("createdAt")
        }

        //pagination
        const page = Number(req.query.page) || 1;
        const limit = Number(req.query.limit);
        const skip = (page - 1) * limit

        jobs = jobs.skip(skip).limit(limit);

        //count
        const total = await jobModel.countDocuments(jobs);
        const pageNumber = Math.ceil(total / limit);



        const finalJobs = await jobs;

        res.status(200).send({
            success: true,
            pageNumber,
            page,
            total,
            finalJobs


        });



    }

    async removeJob(req, res, next) {
        const { id } = req.params;

        try {
            const job = await jobModel.findOne({ _id: id });
            console.log(job);
            if (!job) next("No Job found");

            console.log(job.createdBy.toString());
            console.log(req.user.userId);

            if (job.createdBy != req.user.userId) {
                next("Not authorized to delete the job");
            } else {
                await job.remove;
                res.json({ success: true, data: "Deleted Successfully" });
            }
        } catch (error) {
            next(error);
        }
    }

    async jobStats(req, res, next) {
        try {
            const stats = await jobModel.aggregate([
                {
                    $match: {
                        createdBy: new mongoose.Types.ObjectId(req.user.userId),
                    },
                },
                { $group: { _id: "$status", count: { $sum: 1 } } },
            ]);

            const monthlyApplication = await jobModel.aggregate([
                {
                    $match: {
                        createdBy: new mongoose.Types.ObjectId(req.user.userId),
                    },
                },
                {
                    $group: {
                        _id: {
                            year: { $year: "$createdAt" },
                            month: { $month: "$createdAt" }
                        },
                        count: { $sum: 1 }
                    }
                }
            ]);

            let formatedDate = monthlyApplication.map(item => {

                const { _id: { year, month }, count } = item;
                const date = moment().month(month - 1).year(year).format('MMM y')
                return { date, count };

            });

            const stat = {
                pending: 0,
                rejected: 0,
                interviewed: 0,
            };
            stats.forEach((job) => {
                switch (job._id) {
                    case "pending":
                        stat.pending += job.count;
                        break;
                    case "rejected":
                        stat.rejected += job.count;
                        break;
                    case "interview":
                        stat.interviewed += job.count;
                        break;
                    default:
                        break;
                }
            });
            await res.status(200).json({
                success: true,
                totalJobs: stats.length,
                stat,
                formatedDate,
            });
        } catch (error) {
            console.log(error);
        }

        //get total number of jobs
    }
}
