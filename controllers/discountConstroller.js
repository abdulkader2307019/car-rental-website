const Discount=require('../models/discountSchema');


const discount_post = async (req,res)=>{

    try{
        const {code, discountPercent, validUntil, usageLimit} = req.body;
        if(!code || !discountPercent || !validUntil){
            return res.status(400).json({
                success: false,
                message: 'Code, discountPercent, and validUntil are required.'
            });
        }

        const existing = await Discount.findOne({code});
        if(existing){
            return res.status(400).json({
                success: false,
                message: 'Discount Code already exists.'
            });
        }

        const newDiscount = new Discount({
            code,
            discountPercent,
            validUntil:new Date(validUntil),
            usageLimit: usageLimit || null,
            usageCount: 0
        });

        await newDiscount.save();
        res.status(201).json({
            success:true,
            message:'Discount code created successfully.',
            data:newDiscount
        });

    } catch{
        console.error('Error creating discount:',err);
        res.status(500).json({
            success:false,
            message: 'Server error. Failed to create discount code.'
        });
    }
};


module.exports = {discount_post};