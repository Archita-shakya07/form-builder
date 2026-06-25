import { Request, Response } from 'express';
import { supabase } from '../config/supabase';

export const getResponses = async (req: Request, res: Response) => {
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
      count: data?.length || 0,
      data
    });

  } catch (error: any) {
    return res.status(500).json({
      success: false,
      message: error.message
    });
  }
};