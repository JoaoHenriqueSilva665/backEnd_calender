import { Request, Response } from 'express'

import db from '../database/connection';
import convertHourToMinut from '../utils/converHourToMinut';

interface ScheduleItem {
  week_day: number,
  from: string,
  to: string
}

export default class ClassesController {

  async index(req: Request, res: Response){
    const users = await db('classes')
    .join('users', "classes.user_id", "=", "users.id")
    .select(["classes.*", "users.*"])
    return res.json(users)
  }

  async show(req: Request, res: Response){
    const filters = req.query

    const subject = filters.subject as string
    const week_day = filters.week_day as string
    const time = filters.time as string

    if (!filters.subject || !filters.week_day || !filters.time) {
      return res.status(400).json({error: "filters not found"})
    }

    const timeInMinute = convertHourToMinut(time)
    const classes = await db("classes")
      //so vai funcionar de fato se houver um dado relacionado
      .whereExists(function(){
        //SELECT * FROM
        this.select('class_schedule.*')
        .from("class_schedule")
        //class_schedule.class_id = classes.id
        .whereRaw('`class_schedule`.`class_id` = `classes`.`id`')
        //classes_schedule.week_day = week_day
        .whereRaw('`class_schedule`.`week_day` = ??', [Number(week_day)])
        //filtrar por hora "de" e "ate"
        .whereRaw('`class_schedule`.`from` <= ??', [timeInMinute])
        .whereRaw('`class_schedule`.`to` > ??', [timeInMinute])
      })
      //where simples
      .where("classes.subject", "=", subject)
      .join('users', "classes.user_id", "=", "users.id")
      .select(["classes.*", "users.*"])

    return res.json(classes)
  }

  async create(req: Request, res: Response) {
    const {
      name,
      avatar,
      whatsapp,
      des,
      subject,
      link,
      schedule
    } = req.body

    const trx = await db.transaction()

    try {
      const insertUsersIds = await trx("users").insert({
        name,
        avatar,
        whatsapp,
        des,
      })
      const user_id = insertUsersIds[0];

      const ScheduleIds = await trx('classes').insert({
        subject,
        link,
        user_id
      })

      const class_id = ScheduleIds[0]

      const classSchedule = schedule.map((scheduleItem: ScheduleItem) => {
        return {
          class_id,
          week_day: scheduleItem.week_day,
          from: convertHourToMinut(scheduleItem.from),
          to: convertHourToMinut(scheduleItem.to)
        }
      })
      await trx("class_schedule").insert(classSchedule);

      await trx.commit()
      return res.status(201).send()

    } catch (error) {

      await trx.rollback()
      console.log(error)
      return res.status(400).json({
        error: "Error, don't create class, sorry :("
      })
    }
  }
}