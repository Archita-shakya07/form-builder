import { Request, Response } from 'express';
import { supabase } from '../config/supabase';
import { randomUUID } from 'crypto';

export const submitForm = async (req: Request, res: Response) => {
  try {
    const formData = req.body;

    const dataToInsert = {
      id: randomUUID(),
      fullname: formData.fullName,
      email: formData.email,
      phone: formData.phone,
      dateofbirth: formData.dateOfBirth,
      gender: formData.gender,
      maritalstatus: formData.maritalStatus,
      nationality: formData.nationality,
      aadharnumber: formData.aadharNumber,
      pannumber: formData.panNumber,
      addresses: JSON.stringify(formData.addresses),
      emergencyname: formData.emergencyName,
      emergencyrelation: formData.emergencyRelation,
      emergencyphone: formData.emergencyPhone,
      education: JSON.stringify(formData.education),
      workexperience: JSON.stringify(formData.workExperience),
      skills: formData.skills,
      languages: formData.languages,
      hobbies: formData.hobbies,
      documents: formData.documents,
      termsaccepted: formData.termsAccepted,
      declaration: formData.declaration,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('forms')
      .insert([dataToInsert])
      .select();

    if (error) {
      console.error('Supabase error:', error);
      return res.status(500).json({ 
        success: false, 
        message: 'Database error: ' + error.message 
      });
    }

    return res.status(201).json({
      success: true,
      message: 'Form submitted successfully!',
      data: data[0]
    });

  } catch (error: any) {
    console.error('Server error:', error);
    return res.status(500).json({
      success: false,
      message: 'Server error: ' + error.message
    });
  }
};

export const getAllForms = async (req: Request, res: Response) => {
  try {
    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

export const getFormById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const { data, error } = await supabase
      .from('forms')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      return res.status(500).json({ 
        success: false, 
        message: error.message 
      });
    }

    return res.status(200).json({
      success: true,
      data
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};