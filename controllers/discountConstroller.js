const { render } = require('ejs');
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

    } catch(err){
        console.error('Error creating discount:',err);
        res.status(500).json({
            success:false,
            message: 'Server error. Failed to create discount code.'
        });
    }
};

const discount_apply_post = async (req, res) => {
  const { code, originalPrice } = req.body;

  try {
    const discount = await Discount.findOne({ code });

    if (!discount) {
      return res.status(400).json({
        success: false,
        message: 'Discount does not exist in the database.',
      });
    }

    if (new Date(discount.validUntil) < new Date()) {
      return res.status(400).json({
        success: false,
        message: 'Discount is expired.',
      });
    }

    if (discount.usageLimit && discount.usedCount >= discount.usageLimit) {
      return res.status(400).json({
        success: false,
        message: 'Discount usage limit reached.',
      });
    }

    const discountedPrice = originalPrice * (1 - discount.discountPercent / 100);

    discount.usedCount += 1;
    await discount.save();

    return res.status(200).json({
      success: true,
      discountedPrice,
      message: 'Discount applied successfully.',
    });
    

  } catch (err) {
    console.error('Error applying discount:', err);
    res.status(500).json({
      success: false,
      message: 'Server error. Failed to apply discount code.',
    });
  }
};

const discount_get = async (req, res) => {
  try {
    const discounts = await Discount.find();
    res.render('../views/AdminPage/Admin.ejs', { discounts });
  } catch (err) {
    console.log('Error fetching discounts:', err);
    res.status(500).send('Internal Server Error');
  }
};




module.exports = {discount_post,discount_apply_post,discount_get};