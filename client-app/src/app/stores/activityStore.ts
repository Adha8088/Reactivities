import { observable, action, makeObservable, computed, configure, runInAction } from "mobx";
import { createContext, SyntheticEvent } from "react";

import { Activities } from "../api/agent";
import { IActivity } from "../models/activities";

configure({ enforceActions: 'always'});

class ActivityStore {

    @observable activityRegistery = new Map<string, IActivity>();    
    @observable selectedActivity: IActivity | null = null;

    @observable target: string = "";
    @observable editMode = false;
    @observable submitting = false;
    @observable loadingInitial = false;    

    constructor() {
        makeObservable(this);
    }

    @computed get activitiesByDate() {
        return Array.from(this.activityRegistery.values())
            .sort((a, b) => Date.parse(a.date) - Date.parse(b.date));
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

     @action createActivity = async (activity: IActivity) => {
         this.submitting = true;
         try {
            await Activities.create(activity);            
            runInAction(() => {
                this.activityRegistery.set(activity.id, activity);            
                this.editMode = false;
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
               this.editMode = false;
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

     @action openCreateForm = () => {
         this.editMode = true;
         this.selectedActivity = null;
     }

     @action openEditForm = (id: string) => {
        this.editMode = true;
        this.selectedActivity = this.activityRegistery.get(id) || null;
    }    

     @action selectActivity = (id: string) => {
         this.selectedActivity = this.activityRegistery.get(id) || null; 
         this.editMode = false;
     }
     
     @action cancelSelectedActivity = () => {
        this.selectedActivity = null;         
     }

     @action cancelFormOpen = () => {                
        this.editMode = false;
    }
}

export default createContext(new ActivityStore());