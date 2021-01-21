import { observable, action, makeObservable, computed, configure, runInAction, ObservableMap } from "mobx";
import { createContext, SyntheticEvent } from "react";

import { Activities } from "../api/agent";
import { IActivity } from "../models/activities";

configure({ enforceActions: 'always'});

class ActivityStore {

    @observable activityRegistery = new ObservableMap<string, IActivity>();
    @observable activity: IActivity | null = null;

    @observable target: string = "";    
    @observable submitting = false;
    @observable loadingInitial = false;    

    constructor() {
        makeObservable(this);
    }

    @computed get activitiesByDate() {
        return this.groupActivitiesByDate(Array.from(this.activityRegistery.values()));        
    }

    groupActivitiesByDate(activities: IActivity[]) {
        const sorted = activities
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));        

        return Object.entries(sorted.reduce((activities, activity) => {
            const date = activity.date.split('T')[0];
            if (!activities[date])
                activities[date] = [];
            activities[date].push(activity);
            return activities;
        },{} as {[key: string]: IActivity[]}));
    }

    @action loadActivities = async () => {
        this.loadingInitial = true;        
        try {
            const activities = await Activities.list();
            runInAction(() => {
                activities.forEach(a => {
                    a.date = a.date.split('.')[0];
                    this.activityRegistery.set(a.id, a);
                })
            })              
        }
        catch (e) {
            console.error(e);
        }
        finally {
            runInAction(() => {
                this.loadingInitial = false
            })            
        }       
     }

     @action clearActivity = () => {
         this.activity = null;
     }

     @action loadActivity = async (id: string) => {
         let activity = this.getActivity(id);
         if (activity)
            this.activity = activity;
        else {
            this.loadingInitial = true;            
            try {
                activity = await Activities.details(id);
                runInAction(() => {
                    this.activity = activity || null;                    
                })
            } 
            catch (error) {
                console.log(error);
            }
            finally {
                runInAction(() => {
                    this.loadingInitial = false
                })
            }
        }
     }

     getActivity = (id: string) => {
         return this.activityRegistery.get(id);
     }

     @action createActivity = async (activity: IActivity) => {
         this.submitting = true;
         try {
            await Activities.create(activity);            
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);
            })            
         } 
         catch (error) {
            console.error(error);
         }
         finally {
             runInAction(() => {             
                this.submitting = false;
             })
         }
     }

     @action editActivity = async (activity: IActivity) => {
        this.submitting = true;
        try {
           await Activities.update(activity);
           runInAction(() => {  
               this.activityRegistery.set(activity.id, activity);
               this.selectActivity = action;
           })
        } 
        catch (error) {
           console.error(error);
        }
        finally {
            runInAction(() => {             
                this.submitting = false;
            })
        }
     }

     @action deleteActivity = async (event: SyntheticEvent<HTMLButtonElement>, id: string) => {
         this.submitting = true;
         this.target = event.currentTarget.name;
         try {
             await Activities.delete(id);
             runInAction(() => { 
                this.activityRegistery.delete(id); 
             })            
         } 
         catch (error) {
            console.error(error);
         }
         finally {       
            runInAction(() => {       
                this.target = '';
                this.submitting = false;
            })
         }
     }
   
     @action selectActivity = (id: string) => {
         this.activity = this.activityRegistery.get(id) || null; 
     }
}

export default createContext(new ActivityStore());